import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    borderRadius: 18,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'center',
    height: 3,
    backgroundColor: 'transparent',
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'white',
  },
  topBar: {
    position: 'absolute',
    left: 15,
    top: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  buttonContainer: {
    position: 'absolute',
    right: 10,
    top: 25,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default styles;
