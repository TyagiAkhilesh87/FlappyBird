import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CONFIG = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BIRD_SIZE: 40,
  GRAVITY: 0.6,
  JUMP_FORCE: -8,
  PIPE_WIDTH: 70,
  PIPE_GAP: 200,
  PIPE_SPEED: 4.5,
  PIPE_SPAWN_INTERVAL: 1500, // ms
  MAX_VELOCITY: 12,
  BIRD_X: SCREEN_WIDTH / 4,
};

export const COLORS = {
  SKY: '#4EC0CA',
  BIRD: '#F7D308',
  PIPE: '#73BF2E',
  GROUND: '#DDD894',
  WHITE: '#FFFFFF',
  TEXT: '#333333',
  PRIMARY: '#FF416C',
  SECONDARY: '#FF4B2B',
};
