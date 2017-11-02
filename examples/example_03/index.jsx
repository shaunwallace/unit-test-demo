import React, { Component } from 'react';
import PropTypes from 'prop-types';

const noop = () => null;

const Status = {
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};

class Img extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    alt: PropTypes.string,
    defaultUrl: PropTypes.string,
    placeholder: PropTypes.node,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    loaded: PropTypes.bool,
  };

  static defaultProps = {
    imageUrl: '',
    defaultUrl: '',
    alt: '',
    placeholder: React.createElement('span'),
    onLoad: noop,
    onError: noop,
    loaded: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageStatus: Status.LOADING,
      url: this.props.imageUrl || this.props.defaultUrl,
    };
  }

  componentDidMount() {
    if (!this.props.loaded) {
      this.timer = setTimeout(() => {
        this.setState({
          imageStatus: Status.LOADED,
          url: this.props.defaultUrl,
        });
        clearTimeout(this.timer);
      }, 10000);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.imageStatus !== this.state.imageStatus ||
      nextProps.loaded !== this.props.loaded
    );
  }

  onLoad = () => {
    this.props.onLoad();
    this.setState({ imageStatus: Status.LOADED });
    clearTimeout(this.timer);
  };

  onError = () => {
    this.props.onError();
    this.setState({
      imageStatus: Status.FAILED,
      url: this.props.defaultUrl,
    });
    clearTimeout(this.timer);
  };

  render() {
    const { alt, placeholder } = this.props;
    return (
      <div>
        <img
          src={this.state.url}
          alt={alt}
          onLoad={this.onLoad}
          onError={this.onError}
        />
        {!this.props.loaded &&
          this.state.imageStatus === Status.LOADING &&
          placeholder && <div>{placeholder}</div>}
      </div>
    );
  }
}

export default Img;
