import React from 'react';
import PropTypes from 'prop-types';
import classnames from '../../lib/classnames';
import getClassName from '../../helpers/getClassName';
import './Root.css';
import transitionEvents from '../../lib/transitionEvents';
import {ANDROID, platform} from '../../lib/platform';

const osname = platform();
const baseClassName = getClassName('Root');

export default class Root extends React.Component {

  constructor (props) {
    super();

    this.state = {
      activeView: props.activeView,
      prevView: null,
      nextView: null,
      visibleViews: [props.activeView],
      isBack: undefined,
      scrolls: {}
    };
  }

  static propTypes = {
    activeView: PropTypes.string.isRequired,
    popout: PropTypes.node,
    onTransition: PropTypes.func,
    children: PropTypes.node
  };

  static defaultProps = {
    popout: null
  };

  static contextTypes = {
    window: PropTypes.any,
    document: PropTypes.any
  };

  get document () {
    return this.context.document || document;
  }

  get window () {
    return this.context.window || window;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.popout && !this.props.popout) {
      this.blurActiveElement();
    }

    if (nextProps.activeView !== this.props.activeView) {
      let pageYOffset = this.window.pageYOffset;
      const firstLayerId = this.props.children.find(view => {
        return view.props.id === this.props.activeView || view.props.id === nextProps.activeView;
      }).props.id;
      const isBack = firstLayerId === nextProps.activeView;

      this.blurActiveElement();

      const nextView = nextProps.activeView;
      const prevView = this.props.activeView;

      this.setState({
        scrolls: Object.assign({}, this.state.scrolls, {
          [this.props.activeView]: pageYOffset
        }),
        transition: true,
        activeView: null,
        nextView,
        prevView,
        visibleViews: [nextView, prevView],
        isBack
      });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.transition && this.state.transition) {
      this.prevViewEl.querySelector('.View__panel').scrollTop = this.state.scrolls[this.state.prevView];

      if (this.state.isBack) {
        this.nextViewEl.querySelector('.View__panel').scrollTop = this.state.scrolls[this.state.nextView];
      }
      this.waitAnimationFinish(this.state.isBack ? this.prevViewEl : this.nextViewEl, this.onAnimationEnd);
    }
  }

  waitAnimationFinish (elem, eventHandler) {
    if (transitionEvents.supported) {
      const eventName = transitionEvents.prefix ? transitionEvents.prefix + 'AnimationEnd' : 'animationend';

      elem.removeEventListener(eventName, eventHandler);
      elem.addEventListener(eventName, eventHandler);
    } else {
      setTimeout(eventHandler.bind(this), osname === ANDROID ? 300 : 600);
    }
  }

  onAnimationEnd = (e = { manual: true }) => {
    if (['root-android-animation-hide-back', 'root-android-animation-show-forward', 'root-ios-animation-hide-back', 'root-ios-animation-show-forward'].indexOf(e.animationName) > -1 || e.manual) {
      const isBack = this.state.isBack;
      this.setState({
        activeView: this.state.nextView,
        prevView: null,
        nextView: null,
        visibleViews: [this.state.nextView],
        transition: false,
        isBack: undefined
      }, () => {
        isBack ? this.window.scrollTo(0, this.state.scrolls[this.state.activeView]) : this.window.scrollTo(0, 0);
        this.props.onTransition && this.props.onTransition(this.state.isBack);
      });
    }
  };

  blurActiveElement () {
    if (typeof this.window !== 'undefined' && this.document.activeElement) {
      this.document.activeElement.blur();
    }
  }

  render () {
    let Views = React.Children.toArray(this.props.children).filter((View) => this.state.visibleViews.indexOf(View.props.id) >= 0);
    return (
      <div className={ classnames(baseClassName, {
        'Root--transition': this.state.transition
      }) }>
        { Views.map(View => (
          <div key={View.props.id} className={classnames('Root__view', {
            'Root__view--hide-back': View.props.id === this.state.prevView && this.state.isBack,
            'Root__view--hide-forward': View.props.id === this.state.prevView && !this.state.isBack,
            'Root__view--show-back': View.props.id === this.state.nextView && this.state.isBack,
            'Root__view--show-forward': View.props.id === this.state.nextView && !this.state.isBack,
            'Root__view--active': View.props.id === this.state.activeView
          })} ref={ el => {
            if (View.props.id === this.state.prevView) this.prevViewEl = el;
            if (View.props.id === this.state.nextView) this.nextViewEl = el;
          } }>
            { View }
          </div>
        )) }
        {this.props.popout && <div className="Root__popout">{this.props.popout}</div>}
      </div>
    );
  }
}
