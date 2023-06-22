import React, { useEffect, useState, useRef } from "react";
import Excalidraw, {
  exportToCanvas,
  exportToSvg,
  exportToBlob
} from "@excalidraw/excalidraw-next";
import InitialData from "./initialData";
import Sidebar from "./sidebar/sidebar";

import "./styles.scss";
import initialData from "./initialData";

const renderTopRightUI = () => {
  return (
    <button onClick={() => alert("This is dummy top right UI")}>
      {" "}
      Click me{" "}
    </button>
  );
};

const renderFooter = () => {
  return (
    <button onClick={() => alert("This is dummy footer")}>
      {" "}
      custom footer{" "}
    </button>
  );
};

export default function App() {
  const excalidrawRef = useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);
  const imageArray = [
    {
      created: 1638864038605,
      dataURL:
        "data:image/png;base64,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",
      id: "yuvraj",
      mimeType: "image/png"
    }
  ];
  const convertPng = async () => {
    console.log("asd");
    const blob = await exportToBlob({
      elements: excalidrawRef.current.getSceneElements(),
      mimeType: "image/png",
      appState: {
        viewBackgroundColor: "#FFFFFF"
      }
    });
    console.log(window.URL.createObjectURL(blob));
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      console.log(base64data);
    };
  };
  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: []
        },
        {
          fileId: "yuvraj",
          type: "image",
          x: 300.5703125,
          y: 190.69140625,
          width: 198.21875,
          height: 129.51171875,
          angle: 0,
          strokeColor: "#000000",
          backgroundColor: "transparent",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          groupIds: [],
          seed: 957947807,
          version: 47,
          versionNonce: 1128618623,
          isDeleted: false
        }
      ],
      appState: {
        viewBackgroundColor: "#edf2ff"
      }
    };
    excalidrawRef.current.updateScene(sceneData);
    excalidrawRef.current.addFiles(imageArray);
  };

  return (
    <div className="App">
      <h1> Excalidraw Example</h1>
      <Sidebar>
        <div className="button-wrapper">
          <button className="update-scene" onClick={updateScene}>
            Update Scene
          </button>
          <button
            className="reset-scene"
            onClick={() => {
              excalidrawRef.current.resetScene();
            }}
          >
            Reset Scene
          </button>
          <label>
            <input
              type="checkbox"
              checked={viewModeEnabled}
              onChange={() => setViewModeEnabled(!viewModeEnabled)}
            />
            View mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={zenModeEnabled}
              onChange={() => setZenModeEnabled(!zenModeEnabled)}
            />
            Zen mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={gridModeEnabled}
              onChange={() => setGridModeEnabled(!gridModeEnabled)}
            />
            Grid mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => {
                let newTheme = "light";
                if (theme === "light") {
                  newTheme = "dark";
                }
                setTheme(newTheme);
              }}
            />
            Switch to Dark Theme
          </label>
        </div>
        <div className="excalidraw-wrapper">
          <Excalidraw
            ref={excalidrawRef}
            initialData={InitialData}
            onChange={(elements, state) =>
              console.log("Elements :", elements, "State : ", state)
            }
            onPointerUpdate={(payload) => console.log(payload)}
            onCollabButtonClick={() =>
              window.alert("You clicked on collab button")
            }
            viewModeEnabled={viewModeEnabled}
            zenModeEnabled={zenModeEnabled}
            gridModeEnabled={gridModeEnabled}
            theme={theme}
            name="Custom name of drawing"
            UIOptions={{ canvasActions: { loadScene: false } }}
            renderTopRightUI={renderTopRightUI}
            renderFooter={renderFooter}
          />
        </div>

        <div className="export-wrapper button-wrapper">
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={exportWithDarkMode}
              onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
            />
            Export with dark mode
          </label>
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={shouldAddWatermark}
              onChange={() => setShouldAddWatermark(!shouldAddWatermark)}
            />
            Add Watermark
          </label>
          <button
            onClick={async () => {
              const svg = await exportToSvg({
                elements: excalidrawRef.current.getSceneElements(),
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  shouldAddWatermark,
                  width: 300,
                  height: 100
                },
                embedScene: true
              });
              document.querySelector(".export-svg").innerHTML = svg.outerHTML;
            }}
          >
            Export to SVG
          </button>
          <div className="export export-svg"></div>

          <button
            onClick={async () => {
              const blob = await exportToBlob({
                elements: excalidrawRef.current.getSceneElements(),
                mimeType: "image/png",
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  shouldAddWatermark
                },
                files: excalidrawRef.current.getFiles()
              });
              setBlobUrl(window.URL.createObjectURL(blob));
            }}
          >
            Export to Blob
          </button>
          <div className="export export-blob">
            <img src={blobUrl} alt="" />
          </div>

          <button
            onClick={() => {
              const canvas = exportToCanvas({
                elements: excalidrawRef.current.getSceneElements(),
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  shouldAddWatermark
                }
              });
              const ctx = canvas.getContext("2d");
              ctx.font = "30px Virgil";
              ctx.strokeText("My custom text", 50, 60);
              setCanvasUrl(canvas.toDataURL());
            }}
          >
            Export to Canvas
          </button>
          <div className="export export-canvas">
            <img src={canvasUrl} alt="" />
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
