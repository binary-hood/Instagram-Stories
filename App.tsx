import React, {useState} from 'react';
import Profile from './src/components/Profile';
import StoryComponent from './src/components/StoryComponent';

function App(): React.JSX.Element {
  const [insideStory, setInsideStory] = useState(false);

  function openStory() {
    setInsideStory(true);
  }

  function closeStory() {
    setInsideStory(false);
  }

  return insideStory ? (
    <StoryComponent onFinishStory={closeStory} />
  ) : (
    <Profile
      outLineColor="#33ad1d"
      displayName="Binaryhood"
      onPressWrapped={openStory}
    />
  );
}

export default App;
