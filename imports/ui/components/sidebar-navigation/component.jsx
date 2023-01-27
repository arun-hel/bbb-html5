import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import PropTypes from "prop-types";
import Resizable from "re-resizable";
import { ACTIONS, PANELS } from "../layout/enums";
import UserListContainer from "../user-list/container";

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

const SidebarNavigation = (props) => {
  const {
    top,
    left,
    right,
    zIndex,
    minWidth,
    width,
    maxWidth,
    height,
    isResizable,
    resizableEdge,
    contextDispatch,
  } = props;

  const [resizableWidth, setResizableWidth] = useState(width);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    if (!isResizing) setResizableWidth(width);
  }, [width]);

  useEffect(() => {}, [resizeStartWidth]);

  const setSidebarNavWidth = (dWidth) => {
    const newWidth = resizeStartWidth + dWidth;

    setResizableWidth(newWidth);

    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_SIZE,
      value: {
        width: newWidth,
        browserWidth: window.innerWidth,
        browserHeight: window.innerHeight,
      },
    });
  };

  const onCloseUserLists = () => {
    setIsDrawerOpen(false);
    props.handleUserListState(false);

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
      <Drawer
        PaperProps={{
          sx: { width: "50%" },
        }}
        anchor="right"
        open={isDrawerOpen}
        onClose={onCloseUserLists}
      >
        {/* <style>
        {`

        @media only screen and (max-width: 650px) {
            .user-list {
            height: calc(100% - 100px) !important;
            z-index: 0  !important;

          }
        }
      `}
      </style> */}

        {/* <Resizable
          className="user-list"
          minWidth={minWidth}
          maxWidth={maxWidth}
          size={{
            width,
            height,
          }}
          enable={{
            top: isResizable && resizableEdge.top,
            left: isResizable && resizableEdge.left,
            bottom: isResizable && resizableEdge.bottom,
            right: isResizable && resizableEdge.right,
          }}
          handleStyles={{
            right: {
              right: "-8px",
            },
          }}
          handleWrapperClass="resizeSidebarNavWrapper"
          onResizeStart={() => {
            setIsResizing(true);
            setResizeStartWidth(resizableWidth);
          }}
          onResize={(...[, , , delta]) => setSidebarNavWidth(delta.width)}
          onResizeStop={() => {
            setIsResizing(false);
            setResizeStartWidth(0);
          }}
          style={{
            position: "absolute",
            top,
            left,
            right,
            zIndex,
            width,
            height,
          }}
        >



        </Resizable> */}
        <UserListContainer />
      </Drawer>
    </>
  );
};

SidebarNavigation.propTypes = propTypes;
SidebarNavigation.defaultProps = defaultProps;
export default SidebarNavigation;
