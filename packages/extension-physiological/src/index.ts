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

  private trialStartTime: Date | null = null;
  private trialEndTime: Date | null = null;

  private trialTimingLog: { trial: number; start: Date; end?: Date }[] = [];

  initialize = ({}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  on_start = (): void => {
  const trialIndex = this.jsPsych.getProgress().current_trial_global;
  this.trialStartTime = new Date();

  this.trialTimingLog.push({
    trial: trialIndex,
    start: this.trialStartTime,
  });
};

  on_load = (): void => {};

  on_finish = (): Promise<{ [key: string]: any }> => {
  this.trialEndTime = new Date(); // capture end time

  if (this.trialTimingLog.length > 0) {
    this.trialTimingLog[this.trialTimingLog.length - 1].end = this.trialEndTime;
  }

  const trialStartTime = this.trialStartTime || new Date(this.trialEndTime.getTime() - 1000 * 60 * 5); // fallback: 5 min earlier

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const startTime = formatTime(trialStartTime);
  const endTime = formatTime(this.trialEndTime);
  const date = formatDate(this.trialEndTime);

  const profileUrl = "http://localhost:3000/fitbit-profile";
  const heartUrl = `http://localhost:3000/fitbit-heart?date=${date}&startTime=${startTime}&endTime=${endTime}`;

  return Promise.all([
    fetch(profileUrl).then((res) => res.json()),
    fetch(heartUrl).then((res) => res.json()),
  ])
    .then(([profileData, heartRateData]) => {
      console.log("Fitbit profile:", profileData);
      console.log("Fitbit heart rate:", heartRateData);

      return {
        data1: 99,
        data2: "hello world!",
        profile: profileData,
        heartrate: heartRateData,
        heart_rate_window: { startTime, endTime, date },
        timing_log_snapshot: this.trialTimingLog,
      };
    })
    .catch((error: any) => {
      console.error("Error fetching Fitbit data:", error);
      return {
        data1: 99,
        data2: "hello world!",
        error: error.message,
        timing_log_snapshot: this.trialTimingLog,
      };
    });
};
}

export default PhysiologicalExtension;