"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function JSONViewer() {
  const router= useRouter()
  const [data, setData] = useState();
  const [formattedData, setFormattedData] = useState();
  const [copyLegend, setCopyLegend] = useState("Copy");
  const [copyColor, setCopyColor] = useState("bg-blue-500 hover:bg-blue-700");
  const [hasStringified, setHasStringified] = useState(false);
  const [isValidJSON, setIsValidJSON] = useState(true);

  const beautifyJSON = () => {
    ``;
    if (!isValidJSON) {
      alert("Invalid JSON - Please paste the valid JSON");
    }

    if (data) {
      let formatData = JSON.stringify(data, null, 2);
      setFormattedData(formatData);
      setHasStringified(false);
    }
  };

  const minifyJSON = () => {
    if (!isValidJSON) {
      alert("Invalid JSON - Please paste the valid JSON");
    }
    if (!hasStringified) {
      if (formattedData) {
        let formatData = JSON.stringify(JSON.parse(formattedData));
        setFormattedData(formatData);
      } else if (data) {
        let formatData = JSON.stringify(data);
        setFormattedData(formatData);
      }
      setHasStringified(false);
    } else {
      if (formattedData) {
        let formatData = formattedData.replace(/\\/g, "");
        formatData = formatData.substring(1, formatData.length - 1);
        setFormattedData(formatData);
      } else if (data) {
        let formatData = data.replace(/\\/g, "");
        formatData = formatData.substring(1, data.length - 1);
        setFormattedData(formatData);
      }
      setHasStringified(false);
    }
  };

  const stringifyJSON = () => {
    if (!isValidJSON) {
      alert("Invalid JSON - Please paste the valid JSON");
    }
    if (!hasStringified) {
      if (formattedData) {
        let formatData = JSON.stringify(JSON.parse(formattedData));
        formatData = formatData
          .replace(/\\/g, "\\\\")
          .replace(/\u0008/g, "\\b")
          .replace(/\t/g, "\\t")
          .replace(/\n/g, "\\n")
          .replace(/\f/g, "\\f")
          .replace(/\r/g, "\\r")
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"');
        setFormattedData(`"${formatData}"`);
      } else if (data) {
        let formatData = JSON.stringify(data);
        formatData = formatData
          .replace(/\\/g, "\\\\")
          .replace(/\u0008/g, "\\b")
          .replace(/\t/g, "\\t")
          .replace(/\n/g, "\\n")
          .replace(/\f/g, "\\f")
          .replace(/\r/g, "\\r")
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"');
        setFormattedData(`"${formatData}"`);
      }
      setHasStringified(true);
    }
  };

  const clearContent = () => {
    document.getElementById("jsondata").value = "";
    setData();
    setFormattedData();
    setHasStringified(false);
  };

  const storeData = (e) => {
    let value = e.target.value;
    if (value && isJSON(value)) {
      setIsValidJSON(true);
      setData(JSON.parse(value));
    } else {
      setData();
      setFormattedData();
      setHasStringified(false);
      setIsValidJSON(false);
    }
  };

  // const copyData = () => {
  //   if (formattedData || data) {
  //     if (formattedData) {
  //       navigator.clipboard.writeText(formattedData);
  //     } else {
  //       navigator.clipboard.writeText(data);
  //     }
  //     setCopyLegend("Copied!");
  //     setCopyColor("bg-green-500 hover:bg-green-700");
  //     setTimeout(() => {
  //       setCopyLegend("Copy");
  //       setCopyColor("bg-blue-500 hover:bg-blue-700");
  //     }, 3000);
  //   }
  // };

  const isJSON = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <div className="app min-h-screen min-v-screen p-8 bg-grey-lightest font-sans">
      <div className="row flex">
        <div className="col w-screen">
          <div className="box border rounded flex flex-col shadow bg-white">
            <div className="box__title bg-grey-lighter px-3 py-2 border-b">
              <div className="flex text-lg text-grey-darker font-medium justify-center">
                JSON Viewer
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4 mb-4">
                <div className="button-borders" onClick={stringifyJSON}>
                  <button
                    className="primary-button"
                    title="Convert JSON into plain string"
                  >
                    Stringify
                  </button>
                </div>

                <div className="button-borders" onClick={minifyJSON}>
                  <button
                    className="primary-button"
                    title="Minify the JSON - Remove all the whitespaces"
                  >
                    Minify
                  </button>
                </div>
                <div className="button-borders" onClick={beautifyJSON}>
                  <button
                    className="primary-button"
                    title="Convert the JSON into readable format"
                  >
                    Beautify
                  </button>
                </div>
                <div className="button-borders" onClick={clearContent}>
                  <button
                    className="primary-button"
                    title="Convert the JSON into readable format"
                  >
                    Clear
                  </button>
                </div>
                {/* <button
                  role="button"
                  className={`${copyColor} text-white font-medium py-1 px-2 mt-2 border border-blue-700 rounded ${
                    copyLegend === "Copied!"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={copyData}
                  disabled={copyLegend === "Copied!" ? true : ""}
                >
                  {copyLegend}
                </button> */}
                <div className="button-borders" onClick={clearContent}>
                  <button
                    className={`primary-button ${
                      copyLegend === "Copied!"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } `}
                    title="Convert the JSON into readable format"
                    disabled={copyLegend === "Copied!" ? true : ""}
                  >
                    {copyLegend}
                  </button>
                </div>
                <div className="button-borders" onClick={()=>router.push("timer")}>
                  <button
                    className="primary-button"
                    title="Convert the JSON into readable format"
                  >
                    Timer
                  </button>
                </div>
              </div>
            </div>
            <textarea
              id="jsondata"
              placeholder="Paste the JSON here"
              className={`text-grey-darkest flex-1 p-2 bg-transparent focus:outline-none font-mono ${
                !isValidJSON ? "border-4 border-red-500" : ""
              }`}
              name="inputJSON"
              cols="30"
              rows="50"
              value={formattedData}
              onChange={storeData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
