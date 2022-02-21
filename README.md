# Support MAPI versioning using Compute@Edge 

To enable MAPI to serve different colour palettes according to the version of the live app, we developed this service and put it on Fastly platform between the live app and the MAPI so that requests from live apps have to go through the service first.  And we can make MAPI provide all the different palettes in the same response.  When this service in the middle receives requests from live apps, it looks at the headers to determine the version.  After it gets the response from MAPI, it can select the right palette from the MAPI response and put it in the final response.

## How to test
1. 

* Allow only requests with particular HTTP methods
* Match request URL path and methods for routing
* Build synthetic responses at the edge

## Understanding the code

This starter is intentionally lightweight, and requires no dependencies aside from the [`@fastly/as-compute`](https://www.npmjs.com/package/@fastly/as-compute) npm package. It will help you understand the basics of processing requests at the edge using Fastly. This starter includes implementations of common patterns explained in our [using Compute@Edge](https://developer.fastly.com/learning/compute/assemblyscript/) and [VCL migration](https://developer.fastly.com/learning/compute/migrate/) guides.

The starter doesn't require the use of any backends. Once deployed, you will have a Fastly service running on Compute@Edge that can generate synthetic responses at the edge.

## Security issues

Please see our [SECURITY.md](SECURITY.md) for guidance on reporting security-related issues.
