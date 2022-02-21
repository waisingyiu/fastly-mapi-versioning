# Support MAPI versioning using Compute@Edge 

To enable MAPI to serve different colour palettes according to the version of the live app, we developed this service and put it on Fastly platform between the live app and the MAPI so that requests from live apps have to go through the service first.  And we can make MAPI provide all the different palettes in the same response.  When this service in the middle receives requests from live apps, it looks at the headers to determine the version.  After it gets the response from MAPI, it can select the right palette from the MAPI response and put it in the final response.

## How to test
1. Replace the `assemblyscript-json` module with the one provided in this repository (by copying the directory `assemblyscript-json/` into `node_modules/`)
2. Run `fastly compute serve` for local testing, or `fastly compute publish` to deploy to Fastly server


