const functions = require("firebase-functions");
const dotenv = require("dotenv");
dotenv.config({
  path: "../.env"
});
try{
const formidable = require('formidable-serverless');
const firebase = require("firebase-admin");
const cors = require('cors')({ origin: true });
/**
 * +++++++++++++++++++CLOUD FUNCTIONS+++++++++++++++++++++++++++++
 */

/**Import functions
 */
const onCallFunctions = require("./cloud_functions/onCallFunctions");
const onCreateFunctions = require("./cloud_functions/onCreateFunctions");
const onWriteFunctions = require("./cloud_functions/onWriteFunctions");
const onUpdateFunctions = require("./cloud_functions/onUpdateFunctions");
const pubSubFunctions = require("./cloud_functions/pubSubFunctions");

//+++++++++++++++++++++onCall Functions+++++++++++++++++++++++++++++++++
exports.resendVerificationEmail = functions.https.onCall(
  onCallFunctions.resendVerificationEmailHandler
);

exports.sendPasswordUpdateEmail = functions.https.onCall(
  onCallFunctions.sendPasswordUpdateEmailHandler
);

//+++++++++++++++++++++onCreate Functions+++++++++++++++++++++++++++++++
exports.sendVerificationEmail = functions.auth
  .user()
  .onCreate(onCreateFunctions.sendVerificationEmailHandler);

exports.createOrganization = functions.firestore
  .document("cl_org_general/{org_handle}")
  .onCreate(onCreateFunctions.createOrganizationHandler);

//++++++++++++++++++++onWrite Functions+++++++++++++++++++++++++++++++
exports.registerUserHandle = functions.firestore
  .document("cl_user/{uid}")
  .onWrite(onWriteFunctions.registerUserHandleHandler);

//++++++++++++++++++++onUpdate Functions++++++++++++++++++++++++++++++
exports.updateOrgUser = functions.firestore
  .document("cl_org_general/{org_handle}/cl_org_users/users")
  .onUpdate(onUpdateFunctions.addOrgUserHandler);

//++++++++++++++++++++Pub/Sub Functions++++++++++++++++++++++++++++++
exports.deleteTutorialSteps = functions.pubsub
  .schedule("every 7 days")
  .onRun(pubSubFunctions.deleteTutorialStepsHandler);

//++++++++++++++++++++Storage Functions++++++++++++++++++++++++++++++

exports.uploadFile = functions.https.onRequest(async (req, res) => {
  var form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      var file = files.file;

      if (!file) {
        reject(new Error("No file found"));
        return
      }
      var filePath = file.path
      const response = await firebase.storage().bucket('codelabz-966e5.appspot.com').upload(filePath, {
        destination: file.name,
        contentType: file.type,
      });
      const db = firebase.firestore();
      const tutorialRef = db.collection('tutorials').doc(fields.tutorial_id); 
      const tutorialSnapshot = await tutorialRef.get();

      if (!tutorialSnapshot.exists) {
        throw new Error('Tutorial not found');
      }

      const tutorialData = tutorialSnapshot.data();
      const tutorialImages = tutorialData.tutorial_images || []; 
      tutorialImages.push(file.name);

      await tutorialRef.update({ tutorial_images: tutorialImages });

      resolve({ fileInfo: response[0].metadata });
    })
  })
    .then((response) => {
      res.status(200).send(response)
      return null
    }).catch((error) => {
      res.status(500).send(error)
    }
    );
})

exports.deleteFile = functions.https.onRequest(async (req, res) => {
  try {
    const fileName = req.query.fileName; 
    if (!fileName) {
      throw new Error("No filename provided");
    }

    const fileRef = firebase.storage().bucket('codelabz-966e5.appspot.com').file(fileName);

    await fileRef.delete();
    const deleteImage=await firebase.firestore().collection('tutorials').doc(req.query.tutorial_id).update({
      tutorial_images: firebase.firestore.FieldValue.arrayRemove(fileName)
    });

    res.status(200).send("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send(error.message);
  }
});

const { getStorage, ref, getDownloadURL } = require("firebase/storage")

exports.getImages=functions.https.onRequest(async(req,res)=>{
  try {
    const tutorialId = req.query.tutorial_id;
    
    if (!tutorialId) {
      throw new Error("No tutorial ID provided");
    }

    const tutorialSnapshot = await firebase.firestore().collection('tutorials').doc(tutorialId).get();
    
    if (!tutorialSnapshot.exists) {
      throw new Error("Tutorial not found");
    }

    const tutorialData = tutorialSnapshot.data();

    const imageNames = tutorialData.tutorial_images || [];
    
    const imageUrls = [];
    // const storage = getStorage();
    // const pathReference = ref(storage, '');  

    for (const imageName of imageNames) {
      const fileRef = firebase.storage().bucket('codelabz-966e5.appspot.com').file(imageName);
      await fileRef.makePublic();
      fileRef.publicUrl();
      const [url] = await fileRef.getSignedUrl({ action: 'read', expires: '03-01-2500' })
      console.log(url)
      imageUrls.push(url);
    }
    // for(const imageName of imageNames){
    //   getDownloadURL(ref(storage, imageName)).then((url)=>{
    //     console.log(url)
    //   })
    // }
    res.set('Access-Control-Allow-Origin', '*');

    res.status(200).send({ imageUrls });
  } catch (error) {
    console.error("Error retrieving image URLs:", error);
    res.status(500).send(error.message);
  }
})


}catch(e){console.log(e)}