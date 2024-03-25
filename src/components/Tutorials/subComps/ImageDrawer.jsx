import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTutorialImagesReducer,
  remoteTutorialImages,
  uploadTutorialImages,
  uploadTutorialImages2,
  deleteTutorialImages2
} from "../../../store/actions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'firebase/storage';
import Swal from 'sweetalert2'
import '../../../css/codelabz.css'

const useStyles = makeStyles((theme) => ({
  fileInput: {
    display: 'none',
  },
  parentContainer: {
    width: '400px',
    height: '100%',
    display: 'flex',
    padding: '10px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // border: '1px solid #000',
  },
  card: {
    width: '100%',
    height: '50%',
    padding: '10px',
    // boxShadow: '0 5px 5px #ffdfdf',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: 'auto'
    // backgroundColor: '#fff',
  },
  top: {
    textAlign: 'center',
  },
  paragraph: {
    fontWeight: 'bold',
    color: '#0086fe',
  },
  button: {
    outline: '0',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '400',
    padding: '8px 13px',
    width: '100%',
    marginTop: '10px',
    // paddingTop:'px',
    height: '10%',
    backgroundColor: '#0389d1',
  },
  dragArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '150px',
    borderRadius: '5px',
    border: '2px dashed #0086fe',
    visibility: 'visible',
    fontSize: '18px',
  },
  select: {
    color: '#5256ad',
    marginLeft: '5px',
    cursor: 'pointer',
    transition: '0.45s',
  },
  selectHover: {
    opacity: '0.6',
  },
  file: {
    display: 'none',
  },
  container: {
    width: '100%',
    height: '30%',
    display: 'flex',
    // border: '1px solid #000',
    overflowX: 'scroll',
    overflowY: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    maxHeight: '200px',
    overflowY: 'auto',
    marginTop: '10px',
    // marginBottom: '10px',
  },
  imageContainer: {
    width: '75px',
    marginRight: '5px',
    height: '75px',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  deleteIcon: {
    position: 'absolute',
    top: '2px',
    right: '9px',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: '999',
    color: '#0086fe',
  },
  customCard: {
    display: 'flex',
    height: '280px',
    width: '200px',
    // backgroundColor: '#17141d',
    borderRadius: '10px',
    boxShadow: '-1rem 0 3rem #000',
    transition: '0.4s ease-out',
    position: 'relative',
    left: '0px',
    marginBottom: '20px', // Adjusted margin to provide space between cards
  },
  customCardHover: {
    transform: 'translateY(-20px)',
    transition: '0.4s ease-out',
  },
  customTitle: {
    color: 'white',
    fontWeight: '300',
    position: 'absolute',
    left: '20px',
    top: '15px',
  },
  customBar: {
    position: 'absolute',
    top: '100px',
    left: '20px',
    height: '5px',
    width: '150px',
  },
  customEmptyBar: {
    backgroundColor: '#2e3033',
    width: '100%',
    height: '100%',
  },
  customFilledBar: {
    position: 'absolute',
    top: '0px',
    zIndex: '3',
    width: '0px',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(0,154,217,1) 0%, rgba(217,147,0,1) 65%, rgba(255,186,0,1) 100%)',
    transition: '0.6s ease-out',
  },
  customCircle: {
    position: 'absolute',
    top: '150px',
    left: 'calc(50% - 60px)',
  },
  customStroke: {
    stroke: 'white',
    strokeWidth: '2px',
    fill: '#17141d',
    strokeDasharray: '360',
    strokeDashoffset: '360',
    transition: '0.6s ease-out',
  },
  selectedImagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px',
    alignItems: 'center',
    width: '100%',
    height: '50%',
    // marginBottom:'auto'
    // border: '1px solid #000',
  },
  selectedImagesGroup: {
    width: '90%',
    height: '60%',
    position: 'relative',
    display: 'flex',
    padding: '20px',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // overflowX: 'scroll',
    // border: '1px solid #000',
  },
  selectedImage: {
    width: "30%",
    height: "90%",
    cursor: 'pointer',
  },
  imagesCaurosel: {
    // border:"1px solid #000",
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
    // height: '100%',
  },
  forwardButton: {
    position: 'relative',
    width: '100%',
    height: '15%',
    display: 'flex',
    background: '#0389d1',
    color: '#fff',
    borderRadius: '5px',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    // border: '1px solid #000',
  },
  backwardButton: {
    position: 'relative',
    width: '100%',
    height: '15%',
    display: 'flex',
    background: '#0389d1',
    color: '#fff',
    borderRadius: '5px',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    // border: '1px solid #000',
  },
  modal: {
    display: 'none', /* Hidden by default */
    position: 'absolute', /* Stay in place */
    zIndex: '2', /* Sit on top */
    paddingTop: '100px', /* Location of the box */
    left: '0',
    top: '0',
    width: '100%', /* Full width */
    height: '100%', /* Full height */
    overflow: 'auto', /* Enable scroll if needed */
    backgroundColor: 'rgb(0,0,0)', /* Fallback color */
    backgroundColor: 'rgba(0,0,0,0.9)', /* Black w/ opacity */
    [theme.breakpoints.down('sm')]: {
      paddingTop: '50px', /* Adjust for smaller screens */
    },
  },
  modalContent: {
    margin: 'auto',
    display: 'block',
    width: '80%',
    maxWidth: '700px',
    animationName: '$zoom',
    animationDuration: '0.6s',
  },
  '@keyframes zoom': {
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
  },
  close: {
    position: 'absolute',
    top: '15px',
    right: '35px',
    color: '#f1f1f1',
    fontSize: '40px',
    fontWeight: 'bold',
    transition: '0.3s',
    '&:hover, &:focus': {
      color: '#bbb',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  modalImage: {
    width: '100%',
  },
  caption: {
    margin: 'auto',
    display: 'block',
    width: '80%',
    maxWidth: '700px',
    textAlign: 'center',
    color: '#ccc',
    padding: '10px 0',
    height: '150px',
  },
}));


const CrossIcon = styled(CloseIcon)({
  width: '20px',
  height: '20px',
  backgroundColor: "grey",
  borderRadius: '50%',
  color: "white",
  cursor: 'pointer',
  position: 'relative',
  top: -80,
  right: -100,
});


// const ImageCaurousel = ({ images }) => {
//   const classes = useStyles();

//   return (
//     <>
//       {/* <div className={classes.imagesCaurosel} > */}
//       {images.map((image, index) => (
//         <Avatar key={index} alt={image.name} src={image.url} className={classes.selectedImage} variant="rounded" />
//       ))}
//       {/* </div> */}
//     </>
//   )
// }


const ImageDrawer = ({ onClose, visible, owner, tutorial_id, imageURLs }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const classes = useStyles();


  const uploading = useSelector(
    ({
      tutorials: {
        images: { uploading }
      }
    }) => uploading
  );

  const uploading_error = useSelector(
    ({
      tutorials: {
        images: { uploading_error }
      }
    }) => uploading_error
  );

  const deleting = useSelector(
    ({
      tutorials: {
        images: { deleting }
      }
    }) => deleting
  );

  const deleting_error = useSelector(
    ({
      tutorials: {
        images: { deleting_error }
      }
    }) => deleting_error
  );

  useEffect(() => {
    if (uploading === false && uploading_error === false) {
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={true}
        autoHideDuration={6000}
        message="Image Uploaded successfully...."
      />;
    } else if (uploading === false && uploading_error) {
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={true}
        autoHideDuration={6000}
        message={uploading_error}
      />;
    }
  }, [uploading, uploading_error]);

  useEffect(() => {
    if (deleting === false && deleting_error === false) {
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={true}
        autoHideDuration={6000}
        message="Deleted Succefully...."
      />;
    } else if (deleting === false && deleting_error) {
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={true}
        autoHideDuration={6000}
        message={deleting_error}
      />;
    }
  }, [deleting, deleting_error]);

  useEffect(() => {
    clearTutorialImagesReducer()(dispatch);
    return () => {
      clearTutorialImagesReducer()(dispatch);
    };
  }, [dispatch]);

  const props = {
    name: "file",
    multiple: true,
    beforeUpload(file, files) {
      uploadTutorialImages(owner, tutorial_id, files)(
        firebase,
        firestore,
        dispatch
      );
      return false;
    }
  };

  const deleteFile = (name, url) =>
    remoteTutorialImages(
      owner,
      tutorial_id,
      name,
      url
    )(firebase, firestore, dispatch);

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(event) {
    const { files } = event.target;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] === 'image') {
        const timestamp = Date.now();
        const newFileName = `${files[i].name}_${timestamp}`;
        if (!images.some((e) => e.name === newFileName)) {
          setImages((prevImages) => [
            ...prevImages,
            {
              name: newFileName,
              url: URL.createObjectURL(files[i])
            }
          ]);
        }
      }
    }
  }

  function convertImageToDataURL(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result)
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(imageFile);
    });
  }
  const func = async () => {
    console.log('before fetch')
    const response = await fetch(`http://localhost:5001/videoplatform-c31c6/us-central1/getImages?tutorial_id=${tutorial_id}`, {
      method: 'GET',
    })
    const imagesData = await response.json();
    const url = imagesData.imageUrls[0].storage.baseUrl + imagesData.imageUrls[0].baseUrl + '/' + imagesData.imageUrls[0].name;
    console.log(url)
    setSelectedImages([{ name: 'nuu', url: url }])

  }
  useEffect(() => {
    func()
  }, [])

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy"
  }
  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }
  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const { files } = event.dataTransfer;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] === 'image') {
        if (!images.some((e) => e.name === files[i].name)) {
          setImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              url: URL.createObjectURL(files[i])
            }
          ]);
        }
      }
    }
  }


  async function uploadImage() {
    setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...images]);
    let imgs = images
    setImages([]);
    await uploadTutorialImages2(tutorial_id, imgs)(firebase, firestore, dispatch);
  }
  const handleSelectedImageDeleted = async (index) => {
    let imageName = selectedImages[index].name;
    setSelectedImages((prevSelectedImages) => prevSelectedImages.filter((_, i) => i !== index));
    await deleteTutorialImages2(tutorial_id, imageName)(firebase, firestore, dispatch);
  };

  const moveForWard = () => {
    const newArray = [...selectedImages.slice(1), selectedImages[0]]
    setSelectedImages(newArray)
  }

  const moveBackWard = () => {
    const newArray = [selectedImages[selectedImages.length - 1], ...selectedImages.slice(0, selectedImages.length - 1)]
    setSelectedImages(newArray)
  }


  const openModal = (type, index) => {
    console.log('openModal')
    if (type === "images") {
      Swal.fire({
        imageUrl: images[index].url,
        imageHeight: 500,
        imageAlt: images[index].name,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        imageUrl: selectedImages[index].url,
        imageHeight: 500,
        imageAlt: selectedImages[index].name,
        showConfirmButton: false
      });
    }
  };



  return (
    <>
      <Drawer
        title="Images"
        data-testid="imageDrawer"
        anchor="right"
        closable={true}
        onClose={onClose}
        open={visible}
        getContainer={true}
        style={{ position: "absolute" }}
        width="400px"
        className="image-drawer"
        destroyOnClose={true}
        maskClosable={false}
      >
        <div className={classes.parentContainer} data-testId="tutorialImgUpload">
          <div className={classes.card}>
            <div className={classes.top}>
              <p className={classes.paragraph}>Drag & Drop image uploading</p>
            </div>
            <div className={classes.dragArea} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} >
              {isDragging ? (
                <span className={classes.select} >Drop Image here</span>
              ) : (
                <>
                  <span className="select" role="button" onClick={selectFiles} >Browse</span>
                </>
              )}
              <span className={classes.select} role="button" onClick={selectFiles} >or Drop images here</span>
              <input name='file' type='file' className={classes.file} multiple ref={fileInputRef} onChange={onFileSelect} />
            </div>
            {images.length > 0 &&
              <div className={classes.container}>
                {images.map((images, index) => (
                  <div className={classes.imageContainer} key={index} >
                    <span className={classes.deleteIcon} onClick={() => deleteImage(index)} >&times;</span>
                    <img src={images.url} alt={images.name} className={classes.image} onClick={() => openModal("images", index)} />
                  </div>
                ))}
              </div>
            }
            <button className={classes.button} onClick={uploadImage} type='button'>Upload</button>
          </div>

          {selectedImages.length > 0 &&
            <div className={classes.selectedImagesContainer} >
              <h3 style={{ color: '#0389d1' }} >Selected Images </h3>
              <div className={classes.forwardButton} onClick={moveForWard} >
                Move Forward <ArrowForwardIcon />
              </div>
              <AvatarGroup className={classes.selectedImagesGroup} max={selectedImages.length > 4 ? 4 : 3} >
                {selectedImages.map((image, index) => (
                  <>
                    <Avatar key={index} alt={image.name} src={image.url} className={classes.selectedImage} variant="rounded" onClick={() => openModal("selectedImages", index)} />
                    <CrossIcon onClick={() => handleSelectedImageDeleted(index)} />

                  </>
                ))}
              </AvatarGroup>
              <div className={classes.backwardButton} onClick={moveBackWard} ><ArrowBackIcon />Move Backward</div>
            </div>
          }
          {imageURLs &&
            imageURLs.length > 0 &&
            imageURLs.map((image, i) => (
              <Grid className="mb-24" key={i}>
                <Grid xs={24} md={8}>
                  <img src={image.url} alt="" />
                </Grid>
                <Grid xs={24} md={16} className="pl-8" style={{}}>
                  <h4 className="pb-8">{image.name}</h4>

                  <CopyToClipboard
                    text={`![alt=image; scale=1.0](${image.url})`}
                    onCopy={() => (
                      <Snackbar
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left"
                        }}
                        open={true}
                        autoHideDuration={6000}
                        message="Copied...."
                      />
                    )}
                  >
                    <Button type="primary">Copy URL</Button>
                  </CopyToClipboard>

                  <Button
                    loading={deleting}
                    onClick={() => deleteFile(image.name, image.url)}
                    type="ghost"
                    danger
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            ))}
        </div>
      </Drawer></>
  );
};

export default ImageDrawer;
