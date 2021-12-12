import React, { useEffect, useState, Component, } from "react";
import Dropzone from "react-dropzone";
import { FakeLoading } from './fakeloader';

// import UploadService from "../../services/upload-files";

import "./style.css";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      selectedFiles: undefined,
      progressInfo: false,
      progressFinish: false,
      // timeToLeave: Math.floor(Math.random() * 11),
      timeToLeave: 1,
      fileInfos: [],
      fileData: [],
    };
  }

  componentDidMount() {
    // UploadService.getFiles().then((response) => {
    //   this.setState({
    //     fileInfos: response.data,
    //   });
    // });
  }

  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  onDrop(files) {
    if (files.length > 0) {
      this.setState({ selectedFiles: files, progressInfo: true });
    } else {
      this.setState({ progressInfo: false });
    }

    let jsonOutput;

    for (let i = 0, f; (f = files[i]); i++) {
      let reader = new FileReader();

      reader.onload = (function (theFile) {
        return function (e) {
          try {
            jsonOutput = JSON.parse(e.target.result);
            // TODO: add toast
            // console.log('dosya başarıyla yüklendi')
            
          } catch (error) {
            console.error(`hiçbir şey olmasa bile kesin bir şeyler oldu ${error}`);
          }
        };
      })(f);
      reader.readAsText(f);
    }

    // HEY MR WIZARD, GET ME OUT OF HERE!
    setTimeout(() => {
      // console.log(jsonOutput);
      this.setState({ progressFinish: true, fileData: jsonOutput });
      // this.setState({ fileData: jsonOutput });
    }, this.state.timeToLeave * 1000);
  }



  render() {
    const { selectedFiles, progressInfo, fileInfos } = this.state;  

    return (
      <div>
        {progressInfo && <FakeLoading ttl={this.state.timeToLeave} />}
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
