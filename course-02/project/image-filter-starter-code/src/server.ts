import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs'
import mimeTypes from 'mime-types'

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Root Endpoint
  app.get( "/filteredimage", async ( req: express.Request, res: express.Response ) => {
    let image_url = req.query.image_url;
    if (!image_url) {
      return res.status(400).send({ message: 'image_url parameter is required.' });
    }

    // create the temp img
    try {
      const tmpImage = await filterImageFromURL(image_url);

      // get the mime type from the temp created image
      const type = mimeTypes.lookup(tmpImage).toString()

      // read the contents of the temp img
      fs.readFile(tmpImage, function(err, data) {
        if (err) {
          // return err in case of failure
          return res.status(400).send({message: err});
        }
        // if success, return img content with content type so the browser can display it
        return res.status(200).set('Content-Type', type).send(data);
      });

      // delete the temp im
      deleteLocalFiles([tmpImage]);
    } catch(e) {
      return res.status(422).send({message: e});
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();