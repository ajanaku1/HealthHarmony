import React from "react";
import { Series } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { FeatureShowcaseScene } from "./scenes/FeatureShowcaseScene";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { ClosingScene } from "./scenes/ClosingScene";
import {
  TITLE_FRAMES,
  FEATURE_SHOWCASE_FRAMES,
  ARCHITECTURE_FRAMES,
  CLOSING_FRAMES,
} from "./constants";

export const Video: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={TITLE_FRAMES}>
        <TitleScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={FEATURE_SHOWCASE_FRAMES}>
        <FeatureShowcaseScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ARCHITECTURE_FRAMES}>
        <ArchitectureScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CLOSING_FRAMES}>
        <ClosingScene />
      </Series.Sequence>
    </Series>
  );
};
