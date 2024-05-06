import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  cross,
  logo,
  mute,
  pause,
  play,
  stories,
  unmute,
} from '../helper/exportedFunction';
import styles from '../styles/styles';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';

type StoryProp = {
  onFinishStory: () => void;
};

const {width} = Dimensions.get('window');

const StoryComponent: React.FC<StoryProp> = ({onFinishStory}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pausedProgress = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentStory = stories[currentStoryIndex];
  const [isMuted, setIsMuted] = useState(false);
  const [wentBack, setWentBack] = useState(0);

  const renderStoryContent = (story: any) => {
    switch (story.type) {
      case 'image':
        return <Image source={story.image} style={styles.backgroundImage} />;
      case 'video':
        return (
          <Video
            source={story.video}
            resizeMode="cover"
            style={styles.backgroundImage}
            paused={isPaused}
            muted={isMuted}
          />
        );
      case 'lottie':
        return (
          <LottieView
            source={story.lottie}
            style={styles.backgroundImage}
            speed={isPaused ? 0 : 1}
            autoPlay
            loop
          />
        );
      default:
        return null; // setting it to default if type is not recognised
    }
  };

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3,
        useNativeDriver: false,
      }).start(() => {
        pausedProgress.current = 0;
        setCurrentStoryIndex(currentStoryIndex + 1);
        progressAnim.setValue(0);
      });
    } else {
      setWentBack(0);
      onFinishStory();
      setCurrentStoryIndex(0);
    }
  };

  const runProgressAnimation = () => {
    // this will run the animations at the top for the story
    progressAnim.setValue(pausedProgress.current); //set the value of the progress of the story
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: (1 - pausedProgress.current) * 6000, //for how long each story currently 6 seconds
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        goToNextStory(); //once finished goes to nextStory()
      }
    });
  };

  const getProgressBarWidth = (storyIndex: number, currentIndex: number) => {
    if (currentIndex > storyIndex) {
      return '100%';
    } // this is when the Story has been viewed
    if (currentIndex === storyIndex) {
      return progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'], // this is when the story is being viewed
      });
    }
    return '0%'; // this is when the Story has not been viewed yet
  };

  const goToPreviousStory = () => {
    if (isPaused) {
      setIsPaused(false);
    }
    pausedProgress.current = 0;
    progressAnim.setValue(0);
    if (currentStoryIndex === 0) {
      setWentBack(wentBack + 1);
      runProgressAnimation();
    } else {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handlePressIn = () => {
    //for pause if user holds the screen
    setIsPaused(true);
  };

  const handlePressOut = () => {
    //for pause if user releases the holded screen
    setIsPaused(false);
  };

  const handleScreenTouch = (evt: GestureResponderEvent) => {
    //this function takes the width and decided where the click was pressed if left or right
    const touchX = evt.nativeEvent.locationX;
    if (touchX < width / 2) {
      goToPreviousStory();
    } else {
      goToNextStory();
    }
  };

  const pausePlay = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const muteAndUnMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      runProgressAnimation();
    } else {
      progressAnim.stopAnimation(value => {
        pausedProgress.current = value;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStoryIndex, isPaused]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable
        onPress={handleScreenTouch}
        onLongPress={handlePressIn}
        onPressOut={handlePressOut}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.9 : 1, //when clicked shows the user screen a little dimmed for feedback
          },
          styles.container,
        ]}>
        <View style={styles.container}>
          {currentStory.type && renderStoryContent(currentStory)}
          <SafeAreaView>
            <View style={styles.progressBarContainer}>
              {stories.map((story, index) => (
                <View key={index} style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: getProgressBarWidth(index, currentStoryIndex),
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.topBar}>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => muteAndUnMute()}>
                <Image source={isMuted ? mute : unmute} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pausePlay()}>
                <Image source={isPaused ? play : pause} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onFinishStory()}>
                <Image source={cross} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default StoryComponent;
