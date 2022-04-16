import React, { useState } from "react";
import { Grid, Header, Button } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import cuid from "cuid";
import { getFileExtension } from "../util/util";
import { uploadToFirebaseStorage } from "../../firestore/firebaseService";
import { toast } from "react-toastify";
import { updateUserProfilePhoto } from "../../firestore/firestoreService";

import { getDownloadURL } from "firebase/storage";

export default function PhotoUploadWidget({ setEditMode }) {
  const [files, setFiles] = useState([]);
  const [cropper, setCropper] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleUploadImage() {
    setLoading(true);
    const filename = cuid() + "." + getFileExtension(files[0].name);

    cropper.getCroppedCanvas().toBlob((image) => {
      const uploadTask = uploadToFirebaseStorage(image, filename);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          toast.error(error.messege);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateUserProfilePhoto(downloadURL, filename)
              .then(() => {
                setLoading(false);
                handleCancelCrop();
                setEditMode(false);
              })
              .catch((error) => {
                toast.error(error.message);
                setLoading(false);
              });
          });
        }
      );
    });
  }

  function handleCancelCrop() {
    setFiles([]);
    setCropper(null);
  }

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color='teal' sub content='Step 1 - Add Photo' />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color='teal' sub content='Step 2 - Resize' />
        {files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color='teal' sub content='Step 3 - Preview & upload' />
        {files.length > 0 && (
          <>
            <div
              className='img-preview'
              style={{ minHeight: 200, minWidth: 200, overflow: "hidden" }}
            />
            <Button.Group>
              <Button
                loading={loading}
                onClick={handleUploadImage}
                style={{ width: 100 }}
                positive
                icon='check'
              />
              <Button
                disabled={loading}
                onClick={handleCancelCrop}
                style={{ width: 100 }}
                icon='close'
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
