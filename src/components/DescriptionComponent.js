import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import fonts from '../theme/fonts';

export default React.memo((props) => {
  const { description = "", baseStyle = {} } = props;
  const { width } = useWindowDimensions();
  const tagsStyles = { p: { margin: 0 } };
  const systemFonts = [...defaultSystemFonts, ...Object.values(fonts)];

  if (!description) {
    return null;
  }

  return (
    <RenderHtml
      contentWidth={width}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
      systemFonts={systemFonts}
      source={{ html: description }}
    />
  );
});
