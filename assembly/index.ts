
//! Default Compute@Edge template program.
import { Request, Response, Headers, URL, Fastly } from "@fastly/as-compute";
// Using assemblyscript-json
// https://www.npmjs.com/package/assemblyscript-json
import { JSON } from "assemblyscript-json"; 
import { StringSink } from "as-string-sink";

// The entry point for your application.
//
// Use this function to define your main request handling logic. It could be
// used to route based on the request properties (such as method or path), send
// the request to a backend, make completely new requests, and/or generate
// synthetic responses.

function main(req: Request): Response {
    // Filter requests that have unexpected methods.
    if (!["HEAD", "GET"].includes(req.method)) {
        return new Response(String.UTF8.encode("This method is not allowed"), {
            status: 405,
            headers: null,
            url: null
        });
    }

    let url = new URL(req.url);

    // if (url.pathname == "/") {
    // Below are some common patterns for Compute@Edge services using AssemblyScript.
        // Head to https://developer.fastly.com/learning/compute/assemblyscript/ to discover more.

        // Create a new request.
        // let bereq = new Request("http://example.com", {
        //     method: "GET",
        //     headers: null,
        //     body: null
        // });    

        // Add request headers.
        // req.headers.set("X-Custom-Header", "Welcome to Compute@Edge!");
        // req.headers.set(
        //   "X-Another-Custom-Header",
        //   "Recommended reading: https://developer.fastly.com/learning/compute"
        // );

    // Create a cache override.
    let cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setTTL(60);

    // Forward the request to a backend.
    req.headers.set("Accept-Encoding", "identity");
    let beresp = Fastly.fetch(req, {
            backend: "backend_1",
            cacheOverride,
    }).wait();
    // return beresp;

    // Log to a Fastly endpoint.
    //const logger = Fastly.getLogEndpoint("my_endpoint");
    //logger.log("Hello from the edge!");

    if (beresp.status == 200) {

        console.log("Start");
        for (let i = 0; i < beresp.headers.keys().length; i++) {
            let key = beresp.headers.keys().at(i);
            let value = <String>(beresp.headers.get(key));
            console.log("Key=" + key + " Value=" + value);
          }        

        // Parse the JSON response from the backend.
        // logger.log("Response body: ");
        // logger.log(beresp.text());

        let jsonObj: JSON.Obj = changetype<JSON.Obj>(JSON.parse(beresp.text()));
        // jsonObj.set("new_field", JSON.from("content"));
        changePalette(jsonObj, getStyle(req));

        // Construct a new response using the new data but original status and headers.
        let resp = new Response(String.UTF8.encode(jsonObj.toString()), {
        // let resp = new Response(String.UTF8.encode("Hello World"), {
          status: 200,
          headers: beresp.headers,
          url: null,
        });
        return resp;
    }

    // Send a default synthetic response.
    // let headers = new Headers();
    // headers.set('Content-Type', 'text/html; charset=utf-8');

    return beresp;
    // return new Response(String.UTF8.encode("<iframe src='https://developer.fastly.com/compute-welcome' style='border:0; position: absolute; top: 0; left: 0; width: 100%; height: 100%'></iframe>\n"), {
    //     status: 200,
    //     headers,
    //     url: null
    // });

    // Catch all other requests and return a 404.
    // return new Response(String.UTF8.encode("The page you requested could not be found"), {
    //     status: 404,
    //     headers: null,
    //     url: null
    // });
}

function getStyle(req: Request): bool {
    if (! req.headers.has("X-New-UI"))
        return true;
    else
        return false;
}


function changePalette(json: JSON.Obj, newUiFlag: bool): void {
    if (newUiFlag) {
        if (json.has("styleNewUi")) {
            let palette = <JSON.Obj>(json.getObj("styleNewUi"));
            json.set("style", palette);
            json.set("styleNewUi", JSON.from<JSON.Obj>(new JSON.Obj()));
        }
    }
    else {
        if (json.has("styleNewUi")) {
            json.set("styleNewUi", JSON.from<JSON.Obj>(new JSON.Obj()));
        }
    }
}

// function removeControlChar(inStr: string): string {
//     let escaped: i32[] = [];
//     let outBuffer = StringSink.withCapacity(inStr.length);
//     // let outIdx = 0;
//     for (let i = 0; i < inStr.length; i++) {
//       const charCode = inStr.charCodeAt(i);
//       if (
//         charCode >= 0x20 // control characters
//       ) {
//         outBuffer.writeCodePoint(charCode);
//       }
//     }
//     return outBuffer.toString();
// }

// Get the request from the client.
let req = Fastly.getClientRequest();

// Pass the request to the main request handler function.
let resp = main(req);

// Send the response back to the client.
Fastly.respondWith(resp);
