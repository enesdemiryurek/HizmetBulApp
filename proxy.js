const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = 8080;

// Helper to fetch remote resources ignoring SSL errors and rewriting URLs in text/json
function fetchRemote(targetUrl, reqHeaders, clientRes) {
    try {
        const url = new URL(targetUrl);
        const protocol = url.protocol === 'https:' ? https : http;
        
        const headers = { ...reqHeaders };
        delete headers['host'];
        delete headers['proxy-connection'];
        
        // Remove compression headers to get plain text
        Object.keys(headers).forEach(key => {
            if (key.toLowerCase() === 'accept-encoding') {
                delete headers[key];
            }
        });
        
        const options = {
            method: 'GET',
            headers: headers,
            rejectUnauthorized: false // Ignore SSL errors
        };
        
        const remoteReq = protocol.request(targetUrl, options, (remoteRes) => {
            let chunks = [];
            remoteRes.on('data', (chunk) => chunks.push(chunk));
            remoteRes.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const contentType = remoteRes.headers['content-type'] || '';
                const isJson = contentType.includes('json');
                const isText = contentType.includes('text') || contentType.includes('xml');
                
                if (isJson || isText) {
                    let text = buffer.toString('utf8');
                    // Rewrite only packagist URLs to point back to our proxy
                    text = text.replace(/https:\/\/(repo\.)?packagist\.org/g, (match) => {
                        return `http://127.0.0.1:${PORT}/proxy?url=${match}`;
                    });
                    
                    const newBuffer = Buffer.from(text, 'utf8');
                    const responseHeaders = { ...remoteRes.headers };
                    responseHeaders['content-length'] = newBuffer.length;
                    delete responseHeaders['content-encoding'];
                    
                    clientRes.writeHead(remoteRes.statusCode, responseHeaders);
                    clientRes.end(newBuffer);
                } else {
                    clientRes.writeHead(remoteRes.statusCode, remoteRes.headers);
                    clientRes.end(buffer);
                }
            });
        });
        
        remoteReq.on('error', (err) => {
            console.error('Remote fetch error:', err.message);
            clientRes.writeHead(502);
            clientRes.end('Proxy Fetch Error: ' + err.message);
        });
        
        remoteReq.end();
    } catch (e) {
        console.error('Invalid URL:', targetUrl);
        clientRes.writeHead(400);
        clientRes.end('Invalid URL');
    }
}

const server = http.createServer((req, res) => {
    console.log(`[Proxy] Request: ${req.url}`);
    
    // 1. Handle proxy requests: /proxy?url=https://...
    if (req.url.startsWith('/proxy?')) {
        const queryParams = new URL('http://localhost' + req.url).searchParams;
        const targetUrl = queryParams.get('url');
        if (targetUrl) {
            fetchRemote(targetUrl, req.headers, res);
        } else {
            res.writeHead(400);
            res.end('Missing url parameter');
        }
        return;
    }
    
    // 2. Handle Packagist metadata requests
    const targetUrl = 'https://repo.packagist.org' + req.url;
    try {
        const url = new URL(targetUrl);
        const headers = {
            ...req.headers,
            host: 'repo.packagist.org'
        };
        
        // Remove compression headers to get plain text
        Object.keys(headers).forEach(key => {
            if (key.toLowerCase() === 'accept-encoding') {
                delete headers[key];
            }
        });
        
        const options = {
            method: 'GET',
            headers: headers,
            rejectUnauthorized: false // Ignore SSL errors
        };
        
        const remoteReq = https.request(targetUrl, options, (remoteRes) => {
            let chunks = [];
            remoteRes.on('data', (chunk) => chunks.push(chunk));
            remoteRes.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const contentType = remoteRes.headers['content-type'] || '';
                const isJson = contentType.includes('json');
                const isText = contentType.includes('text');
                
                if (isJson || isText) {
                    let text = buffer.toString('utf8');
                    // Rewrite only packagist URLs in metadata to point to our proxy
                    text = text.replace(/https:\/\/(repo\.)?packagist\.org/g, (match) => {
                        return `http://127.0.0.1:${PORT}/proxy?url=${match}`;
                    });
                    
                    const newBuffer = Buffer.from(text, 'utf8');
                    const responseHeaders = { ...remoteRes.headers };
                    responseHeaders['content-length'] = newBuffer.length;
                    delete responseHeaders['content-encoding'];
                    
                    res.writeHead(remoteRes.statusCode, responseHeaders);
                    res.end(newBuffer);
                } else {
                    res.writeHead(remoteRes.statusCode, remoteRes.headers);
                    res.end(buffer);
                }
            });
        });
        
        remoteReq.on('error', (err) => {
            console.error('Packagist fetch error:', err.message);
            res.writeHead(502);
            res.end('Packagist Fetch Error: ' + err.message);
        });
        
        remoteReq.end();
    } catch (e) {
        res.writeHead(500);
        res.end('Internal Proxy Error: ' + e.message);
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Composer proxy server is listening on http://127.0.0.1:${PORT}`);
});
