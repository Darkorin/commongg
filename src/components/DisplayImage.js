import React, { useState } from "react";
import Compress from "compress.js";

function DisplayImage(props) {
  const [image, setImage] = useState(props.currentImg);

  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      const compress = new Compress();

      let img = event.target.files[0];
      setImage(URL.createObjectURL(img));

      if ((img.type === "image/png") || (img.type === "image/gif")) {
        props.setImg(img);
      }
      else {
        compress.compress([img], {
          size: 5,
          quality: .9,
          maxWidth: 1200,
          maxHeight: 675,
          resize: true
        }).then((data) => {
          const imgToCompress = data[0];
          let compressedImage = Compress.convertBase64ToFile(imgToCompress.data, imgToCompress.ext);

          props.setImg(compressedImage);
        });
      }
    }
    props.changedInfo();
  };

  return (
    <div>
      <div>
        <div className="mx-auto">
          <label htmlFor={props.id} >
            <img src={image || props.currentImg || "https://assets.dryicons.com/uploads/icon/svg/9920/974969e2-49be-4625-99be-25daca02778c.svg"}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                margin: "20px",
                cursor: "pointer",
                boxShadow: "3px 3px 25px #171421"
              }}
              alt="profile picture" />
          </label>
          <input
            id={props.id}
            type="file"
            name="UserImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onImageChange} />
        </div>
      </div>
    </div>
  );
}
export default DisplayImage;