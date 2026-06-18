<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->with(['userOne', 'userTwo', 'lastMessage'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($conv) use ($userId) {
                $otherUser = $conv->user_one_id == $userId ? $conv->userTwo : $conv->userOne;
                $lastMessage = $conv->lastMessage;

                return [
                    'id' => $conv->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar ? (str_starts_with($otherUser->avatar, 'http') ? $otherUser->avatar : url('storage/' . $otherUser->avatar)) : null,
                        'last_seen_at' => $otherUser->last_seen_at,
                    ],
                    'last_message' => $lastMessage ? [
                        'body' => $lastMessage->body,
                        'created_at' => $lastMessage->created_at,
                        'is_read' => $lastMessage->is_read,
                        'sender_id' => $lastMessage->sender_id,
                    ] : null,
                    'updated_at' => $conv->updated_at,
                ];
            });

        return response()->json(['conversations' => $conversations]);
    }

    public function show(Request $request, $id)
    {
        $userId = $request->user()->id;

        $conversation = Conversation::where('id', $id)
            ->where(function($q) use ($userId) {
                $q->where('user_one_id', $userId)->orWhere('user_two_id', $userId);
            })->firstOrFail();

        // Mark incoming messages as read
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = $conversation->messages()->orderBy('created_at', 'asc')->get()->map(function($msg) {
            $msg->attachment_url = $msg->attachment_path ? url('storage/' . $msg->attachment_path) : null;
            return $msg;
        });

        $otherUser = $conversation->user_one_id == $userId ? $conversation->userTwo : $conversation->userOne;

        return response()->json([
            'messages' => $messages, 
            'conversation_id' => $conversation->id,
            'other_user' => [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'last_seen_at' => $otherUser->last_seen_at,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf|max:10240',
            'conversation_id' => 'nullable|exists:conversations,id'
        ]);

        if (!$request->body && !$request->hasFile('attachment')) {
            return response()->json(['error' => 'Mesaj veya dosya göndermelisiniz.'], 400);
        }

        // Spam Filter Check
        if ($request->body) {
            $spamWords = ['whatsapp', ' wp ', 'insta', 'instagram', 'telegram'];
            $lowerBody = strtolower($request->body);
            foreach ($spamWords as $word) {
                if (str_contains($lowerBody, $word)) {
                    return response()->json([
                        'error' => 'Güvenliğiniz için platform dışı iletişim (WhatsApp, Instagram vb.) kelimeleri kullanımı yasaktır.'
                    ], 400);
                }
            }
        }

        $senderId = $request->user()->id;
        $receiverId = $request->receiver_id;

        if ($senderId == $receiverId) {
            return response()->json(['error' => 'Kendinize mesaj gönderemezsiniz.'], 400);
        }

        $conversationId = $request->conversation_id;

        if (!$conversationId) {
            $conversation = Conversation::where(function($q) use ($senderId, $receiverId) {
                $q->where('user_one_id', $senderId)->where('user_two_id', $receiverId);
            })->orWhere(function($q) use ($senderId, $receiverId) {
                $q->where('user_one_id', $receiverId)->where('user_two_id', $senderId);
            })->first();

            if (!$conversation) {
                $conversation = Conversation::create([
                    'user_one_id' => $senderId,
                    'user_two_id' => $receiverId,
                ]);
            }
            $conversationId = $conversation->id;
        } else {
            $conversation = Conversation::findOrFail($conversationId);
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'body' => $request->body,
            'attachment_path' => $attachmentPath,
        ]);
        
        $message->attachment_url = $attachmentPath ? url('storage/' . $attachmentPath) : null;

        $conversation->touch(); 

        return response()->json([
            'message' => 'Mesaj gönderildi',
            'data' => $message,
            'conversation_id' => $conversationId
        ]);
    }

    public function handleOffer(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:accept,reject'
        ]);

        $message = Message::findOrFail($id);
        $userId = $request->user()->id;

        // Ensure user is the receiver of the offer (in the conversation, but not the sender)
        if ($message->sender_id == $userId) {
            return response()->json(['error' => 'Kendi teklifinizi yönetemezsiniz.'], 403);
        }

        $conversation = Conversation::where('id', $message->conversation_id)
            ->where(function($q) use ($userId) {
                $q->where('user_one_id', $userId)->orWhere('user_two_id', $userId);
            })->first();

        if (!$conversation) {
            return response()->json(['error' => 'Yetkisiz işlem.'], 403);
        }

        if (str_starts_with($message->body, 'OFFER|')) {
            $parts = explode('|', $message->body);
            $newPrefix = $request->action === 'accept' ? 'OFFER_ACCEPTED' : 'OFFER_REJECTED';
            $parts[0] = $newPrefix;
            
            $message->update(['body' => implode('|', $parts)]);
            $conversation->touch();

            return response()->json(['success' => true, 'message' => $message]);
        }

        return response()->json(['error' => 'Geçersiz teklif mesajı.'], 400);
    }
}
