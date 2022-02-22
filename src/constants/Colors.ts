export const Color = {
  brand100: '#030520',
  brand90: '#171E4F',
  brand80: '#272F5F',
  brand70: '#3D4776',
  brand60: '#59638D',
  brand50: '#7B84A5',
  brand30: '#C1CAE3',
  brand20: '#DCE3F6',
  brand10: '#EDF1FA',
  brand5: '#F5F8FD',
  gray80: 'rgba(0,0,0,0.8)',
  gray70: 'rgba(0,0,0,0.7)',
  gray50: 'rgba(0,0,0,0.5)',
  gray30: 'rgba(0,0,0,0.3)',
  gray10: 'rgba(0,0,0,0.1)',
  white: '#ffffff',
  black: '#000000',
  green: '#10D180',
  blue: '#56B8FF',
  blue70: '#2B6CB7',
  pink30: '#DD8CA7',
  pink10: '#FFA37F',
  denger: '#FF4A3D',
  brandGradation: ['#7B84A5', '#DD8CA7'],
};

const lightGray20 = 'rgba(255,255,255,0.8)';
const lightBorder = Color.gray10;
const darkBorder = 'rgba(255,255,255,0.1)';

export const Colors = {
  light: {
    background: Color.brand5,
    border: lightBorder,
    description: Color.brand50,
    icon: Color.brand80,
    inactive: Color.brand10,
    inactiveTint: Color.brand30,
    primary: Color.blue70,
    text: Color.brand100,
    transBackground: lightGray20,
    shadowColor: Color.brand80,
  },
  dark: {
    background: Color.brand100,
    border: darkBorder,
    description: Color.brand50,
    icon: Color.brand30,
    inactive: Color.brand70,
    inactiveTint: Color.brand80,
    primary: Color.blue,
    text: Color.brand5,
    transBackground: Color.gray80,
    shadowColor: Color.brand10,
  },
};
