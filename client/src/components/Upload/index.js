import React, { useEffect, useState, Component } from "react";
import Dropzone from "react-dropzone";
import { Loading } from "@geist-ui/react";
import UploadService from "../../services/upload-files";

import "./style.css";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      selectedFiles: undefined,
      progressInfo: false,
      fileInfos: [],
    };
  }

  componentDidMount() {
    // UploadService.getFiles().then((response) => {
    //   this.setState({
    //     fileInfos: response.data,
    //   });
    // });
  }

  onDrop(files) {
    if (files.length > 0) {
      this.setState({ selectedFiles: files, progressInfo: true });
    }

    let jsonOP;

    for (let i = 0, f; (f = files[i]); i++) {
      let reader = new FileReader();

      reader.onload = (function (theFile) {
        return function (e) {
          console.log("e readAsText = ", e);
          console.log("e readAsText target = ", e.target);
          try {
            jsonOP = JSON.parse(e.target.result);
            console.log(jsonOP);
          } catch (ex) {
            alert("ex when trying to parse json = " + ex);
          }
        };
      })(f);
      reader.readAsText(f);
    }
  }

  render() {
    const { selectedFiles, progressInfo, fileInfos } = this.state;
    const timeToLeave = Math.floor(Math.random() * 11);

    return (
      <div>
        {progressInfo && <FakeLoading ttl={timeToLeave} />}

        <div className="my-3">
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  {selectedFiles &&
                  Array.isArray(selectedFiles) &&
                  selectedFiles.length ? (
                    <div className="selected-file">
                      {selectedFiles.length > 3
                        ? `${selectedFiles.length} files`
                        : selectedFiles.map((file) => file.name).join(", ")}
                    </div>
                  ) : (
                    "Postman Json dosya çıktınızı sürükleyip bırakabilirsiniz ya da  buraya tıklayıp seçebilirsiniz"
                  )}
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        {fileInfos.length > 0 && (
          <div className="card">
            <div className="card-header">List of Files</div>
            <ul className="list-group list-group-flush">
              {fileInfos &&
                fileInfos.map((file, index) => (
                  <li className="list-group-item" key={index}>
                    <a href={file.url}>{file.name}</a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export const FakeLoading = (props) => {
  let timer;
  const [count, setCount] = useState(0);

  const TTL = props.ttl;

  const updateCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

    if (count === TTL) clearInterval(timer);
  };

  useEffect(() => {
    updateCount();

    return () => clearInterval(timer);
  }, [count]);

  if (count !== TTL) {
    return <Loading>Dosya yükleniyor</Loading>;
  } else {
    return <></>;
  }
};
