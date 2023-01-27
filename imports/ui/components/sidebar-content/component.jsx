import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Resizable from "re-resizable";
import Drawer from "@mui/material/Drawer";
import { ACTIONS, PANELS } from "../layout/enums";
import ChatContainer from "/imports/ui/components/chat/container";
import NotesContainer from "/imports/ui/components/notes/container";
import PollContainer from "/imports/ui/components/poll/container";
import CaptionsContainer from "/imports/ui/components/captions/container";
import BreakoutRoomContainer from "/imports/ui/components/breakout-room/container";
import WaitingUsersPanel from "/imports/ui/components/waiting-users/container";
import Styled from "./styles";
import ErrorBoundary from "/imports/ui/components/common/error-boundary/component";
import FallbackView from "/imports/ui/components/common/fallback-errors/fallback-view/component";

const propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number,
  right: PropTypes.number,
  zIndex: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  maxWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isResizable: PropTypes.bool.isRequired,
  resizableEdge: PropTypes.objectOf(PropTypes.bool).isRequired,
  contextDispatch: PropTypes.func.isRequired,
};

const defaultProps = {
  left: null,
  right: null,
};

const SidebarContent = (props) => {
  const {
    top,
    left,
    right,
    zIndex,
    minWidth,
    width,
    maxWidth,
    minHeight,
    height,
    maxHeight,
    isResizable,
    resizableEdge,
    contextDispatch,
    sidebarContentPanel,
    amIPresenter,
    layoutContextDispatch,
  } = props;

  const [resizableWidth, setResizableWidth] = useState(width);
  const [resizableHeight, setResizableHeight] = useState(height);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);

  useEffect(() => {
    if (!isResizing) {
      setResizableWidth(width);
      setResizableHeight(height);
    }
  }, [width, height]);

  useEffect(() => {}, [resizeStartWidth, resizeStartHeight]);

  const setSidebarContentSize = (dWidth, dHeight) => {
    const newWidth = resizeStartWidth + dWidth;
    const newHeight = resizeStartHeight + dHeight;

    setResizableWidth(newWidth);
    setResizableHeight(newHeight);

    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_SIZE,
      value: {
        width: newWidth,
        height: newHeight,
        browserWidth: window.innerWidth,
        browserHeight: window.innerHeight,
      },
    });
  };

  const smallSidebar = width < maxWidth / 2;
  const pollDisplay = sidebarContentPanel === PANELS.POLL ? "inherit" : "none";

  const onCloseChat = () => {
    props.handleChatState(false);

    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
      value: false,
    });
    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
      value: false,
    });
    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: PANELS.NONE,
    });
    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
      value: PANELS.NONE,
    });

    contextDispatch({
      type: ACTIONS.SET_ID_CHAT_OPEN,
      value: "",
    });
  };

  return (
    <>
      <style>
        {`

    @media only screen and (max-width: 650px) {
        .chat-list {
        height: calc(100% - 100px) !important;
        z-index: 0  !important;

      }
    }
  `}
      </style>
      <Drawer anchor="right" open={props.isChatOpened} onClose={onCloseChat}>
        {sidebarContentPanel === PANELS.CHAT && (
          <ErrorBoundary Fallback={FallbackView}>
            <ChatContainer
              width={width}
              handleChatState={props.handleChatState}
              handleUserListState={props.handleUserListState}
              isChatOpened={props.isChatOpened}
              isUserListOpned={props.isUserListOpned}
            />
          </ErrorBoundary>
        )}
        {sidebarContentPanel === PANELS.SHARED_NOTES && <NotesContainer />}
        {sidebarContentPanel === PANELS.CAPTIONS && <CaptionsContainer />}
        {sidebarContentPanel === PANELS.BREAKOUT && <BreakoutRoomContainer />}
        {sidebarContentPanel === PANELS.WAITING_USERS && <WaitingUsersPanel />}
        <Styled.Poll
          style={{ minWidth, top: "0", display: pollDisplay }}
          id="pollPanel"
        >
          <PollContainer
            smallSidebar={smallSidebar}
            amIPresenter={amIPresenter}
          />
        </Styled.Poll>
      </Drawer>
    </>
  );
};

SidebarContent.propTypes = propTypes;
SidebarContent.defaultProps = defaultProps;
export default SidebarContent;
