import { JsPsych, JsPsychExtension, JsPsychExtensionInfo, ParameterType } from "jspsych";

//import { version } from "../package.json";

interface InitializeParameters {}

interface OnStartParameters {}

interface OnLoadParameters {}

interface OnFinishParameters {}

/**
 * **extension-physiological**
 *
 * An extension for integrating a physiological device, such as a FitBit.
 *
 * @author Constance Bainbridge and Natasha Chaku
 * @see {@link /extension-physiological/README.md}}
 */
class PhysiologicalExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "extension-physiological",
    //version: version,
    data: {
      /** Provide a clear description of the data1 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      data1: {
        type: ParameterType.INT,
      },
      /** Provide a clear description of the data2 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      data2: {
        type: ParameterType.STRING,
      },
    },
    // When you run build on your extension, citations will be generated here based on the information in the CITATION.cff file.
    citations: "__CITATIONS__",
  };

  constructor(private jsPsych: JsPsych) {}

  initialize = ({}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  on_start = (): void => {
    return;
  };

  on_load = (): void => {};

  on_finish = (): { [key: string]: any } => {
    var profile;
    var hr;
    return new Promise((resolve, reject) => {
      fetch("http://localhost:3000/fitbit-profile")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fitbit data Ohdhdhdksjdfo:", data);
          profile = data;

          // Once data is fetched, resolve the Promise with the return object
          resolve({
            data1: 99, // Ensure these match the expected return format
            data2: "hello world!",
            heartrate: hr,
            profile: profile,
          });
        })
        .catch((error) => {
          console.error("Error fetching Fitbit data:", error);
        });
    });
  };
}

export default PhysiologicalExtension;
