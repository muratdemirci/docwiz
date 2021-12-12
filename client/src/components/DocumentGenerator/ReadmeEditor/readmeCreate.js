import React from "react";

import { Input, Select } from "@geist-ui/react";

const RequestList = (props) => {
  return props.requestDetails.map((val, idx) => {
    let name = `name-${idx}`,
      lorem = `lorem-${idx}`,
      dateOfPublish = `dateOfPublish-${idx}`,
      type = `type-${idx}`,
      ipsum = `ipsum-${idx}`;
    return (
      <div className="form-row" key={val.index}>
        <div className="col">
          <Input
            scale={1 / 3}
            label="name"
            placeholder="Name"
            name="name"
            data-id={idx}
            id={name}
          />
        </div>
        <div className="col">
          <Input
            scale={1 / 3}
            label="name"
            placeholder="lorem"
            name="lorem"
            id={lorem}
            data-id={idx}
          />
        </div>
        <div className="col">
          <Select placeholder="Request tipini seçiniz"  id={type} data-id={idx}>
          <Select.Option value="1">POST</Select.Option>
          <Select.Option value="2">GET</Select.Option>
          <Select.Option value="3">DELETE</Select.Option>
          <Select.Option value="4">PUT</Select.Option>
          </Select>
        </div>
        <div className="col">
          <Input
            scale={1 / 3}
            placeholder="Enter Date"
            label="name"
            name="dateOfPublish"
            id={dateOfPublish}
            data-id={idx}
          />
        </div>
        <div className="col">
          <Input
            scale={1 / 3}
            label="name"
            placeholder="ipsum"
            name="ipsum"
            id={ipsum}
            data-id={idx}
          />
        </div>
        <div className="col p-4">
          {idx === 0 ? (
            <button
              onClick={() => props.add()}
              type="button"
              className="btn btn-primary text-center"
            >
              <i className="fa fa-plus-circle" aria-hidden="true" />
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => props.delete(val)}
            >
              <i className="fa fa-minus" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  });
};
export default RequestList;
