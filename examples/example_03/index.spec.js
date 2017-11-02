/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import Img from './index';

Enzyme.configure({ adapter: new Adapter() });

describe('<Img />', () => {
  it('should render a Img wrapper to pass a placeholder element while the image loads', () => {
    const props = {
      imageUrl: '../../assets/img/card.png',
      alt: 'alt-text',
      selector: 'cardImage0',
      onLoad: () => {},
      onError: () => {},
    };
    const component = ReactTestRenderer.create(<Img {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should set image status to loaded when loading complete', () => {
    const props = {
      imageUrl: '../../assets/img/card.png',
    };

    const component = shallow(<Img {...props} />);
    const img = component.find('img');
    // simulate the load event
    img.simulate('load', {});
    expect(component.state().imageStatus).toEqual('loaded');
  });

  it('should display placeholder while loading', () => {
    const props = {
      imageUrl: '../../assets/img/card.png',
      placeholder: <div />,
    };
    const component = ReactTestRenderer.create(<Img {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display errorMessage if img src not found', () => {
    const props = {
      imageUrl: '',
      placeholder: null,
    };

    const component = shallow(<Img {...props} />);
    const img = component.find('img');
    img.simulate('error', {});
    expect(component.state().imageStatus).toEqual('failed');
  });

  it('should display defaultImg if img src not given', () => {
    const props = {
      imageUrl: '',
      placeholder: null,
      defaultUrl: '../../assets/img/card.png',
    };

    const component = shallow(<Img {...props} />);
    const imgsrc = component.find('img').prop('src');
    expect(imgsrc).toEqual(props.defaultUrl);
  });

  it('should display image from imageUrl', () => {
    const props = {
      imageUrl: '../../assets/img/card.png',
      placeholder: null,
    };

    const component = shallow(<Img {...props} />);
    const imgsrc = component.find('img').prop('src');
    expect(imgsrc).toEqual(props.imageUrl);
  });

  it('should display a default image from using the given defaultUrl prop after a specified timeout', () => {
    jest.useFakeTimers();

    const props = {
      imageUrl: '../../assets/img/card.png',
      placeholder: null,
      defaultUrl: '../../assets/img/default_card_1x.png',
    };

    const component = shallow(<Img {...props} />);
    const imgsrc = component.find('img').prop('src');

    // assert that the relevant state has been updated after a certain time
    setTimeout(() => {
      expect(imgsrc).toBe(props.defaultUrl);
      expect(component.state().imageStatus).toEqual('loaded');
      expect(component.state().default).toEqual(false);
    }, 10000);
  });

  it('should not display a default image if the loaded prop is true', () => {
    jest.useFakeTimers();

    const props = {
      imageUrl: '../../assets/img/card.png',
      placeholder: null,
      defaultUrl: '../../assets/img/default_card_1x.png',
      loaded: true,
    };

    const component = shallow(<Img {...props} />);
    const imgsrc = component.find('img').prop('src');
    setTimeout(() => {
      expect(imgsrc).toBe(props.imageUrl);
    }, 10000);
  });
});
