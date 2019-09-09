import Icon from "../Icon";
import { css, cx } from "emotion";
import React from "react";
import { animated, config, interpolate, Spring } from "react-spring";
import { buildSpacing } from "../../layout/spacing";
import { context } from "../FlyOverProvider/FlyOverProvider";
import { Close24 } from "@carbon/icons-react";
import ReactDOM from "react-dom";
import { Omit } from "type-zoo/types";

const sizeMapping = {
  xl: "560px",
  lg: "460px",
  md: "360px",
  sm: "200px"
};

interface IInternalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "position"> {
  position?: "left" | "right";
  width?: "xl" | "l" | "md" | "sm" | string;
}

const FlyOverContainer = ({ position, width, className, ...otherProps }: IInternalProps) => {
  const cl = css`
    min-width: ${sizeMapping[width] || width};
    max-width: ${sizeMapping[width] || width};
    height: 100%;
    z-index: 70;
    ${buildSpacing("xl 2xl lg 2xl", "padding")};
  `;
  return <animated.div {...otherProps} className={cx(className, cl)} />;
};

export interface IProps extends IInternalProps {
  closable?: boolean;
  onCloseClick?: (Event) => void;
  show?: boolean;
}

interface IState {
  resting: boolean;
  prevProps: IProps;
}

export class FlyOver extends React.PureComponent<IProps, IState> {
  public static defaultProps = {
    position: "left",
    width: "md",
    closable: true,
    show: true
  };

  public state = {
    // Some internal state used to track when to totally hide the flyover element
    resting: !this.props.show,
    prevProps: this.props // a slight hack to track prevProps in state.
  };

  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const { prevProps } = prevState;
    const nextResting = prevProps.show === nextProps.show;
    return { resting: prevState.resting && nextResting, prevProps: nextProps };
  }

  public onRest = () => this.setState({ resting: true });

  public onStart = () => this.setState({ resting: false });

  public renderContent() {
    const { position, width, show, closable, onCloseClick, children, ...otherProps } = this.props;
    const offScreenPosition = position === "left" ? { x: -100 } : { x: 100 };
    const onScreenPosition = { x: 0 };
    if (this.state.resting && !show) {
      return null;
    }
    return (
      <Spring
        native={true}
        from={show ? offScreenPosition : onScreenPosition}
        to={show ? onScreenPosition : offScreenPosition}
        onRest={this.onRest}
        onStart={this.onStart}
        config={{
          ...config.stiff,
          clamp: true
        }}
      >
        {({ x }) => {
          return (
            <FlyOverContainer
              position={position}
              width={width}
              {...otherProps}
              style={{ transform: interpolate([x], xInner => `translate3d(${xInner}%,0,0)`) }}
            >
              {closable && (
                <Icon
                  className={css`
                    top: 1rem;
                    ${position}: 1rem;
                    position: absolute;
                    cursor: pointer;
                  `}
                  onClick={onCloseClick}
                  size="medium"
                >
                  <Close24 />
                </Icon>
              )}
              {children}
            </FlyOverContainer>
          );
        }}
      </Spring>
    );
  }

  public render() {
    return (
      <context.Consumer>
        {args => {
          const containerRef =
            this.props.position === "left" ? args.getLeftRef() : args.getRightRef();
          if (containerRef === null) {
            return null;
          }
          return ReactDOM.createPortal(this.renderContent(), containerRef);
        }}
      </context.Consumer>
    );
  }
}

export default FlyOver;
