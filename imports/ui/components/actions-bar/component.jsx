import React, { PureComponent } from "react";
import CaptionsButtonContainer from "/imports/ui/components/captions/button/container";
import withShortcutHelper from "/imports/ui/components/shortcut-help/service";
import Styled from "./styles";
import { PANELS, ACTIONS } from "../layout/enums";
import ActionsDropdown from "./actions-dropdown/container";
import ScreenshareButtonContainer from "/imports/ui/components/actions-bar/screenshare/container";
import AudioControlsContainer from "../audio/audio-controls/container";
import JoinVideoOptionsContainer from "../video-provider/video-button/container";
import PresentationOptionsContainer from "./presentation-options/component";
const CHAT_CONFIG = Meteor.settings.public.chat;
const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;

class ActionsBar extends PureComponent {
  state = {
    isChatOpened: false,
    isUserListOpned: false,
  };

  componentDidMount() {
    this.state = {
      isChatOpened: this.props.isChatOpened,
      isUserListOpned: this.props.isUserListOpned,
    };
  }

  componentDidUpdate(prevState) {
    if (prevState.isChatOpened != this.props.isChatOpened)
      this.setState({ isChatOpened: this.props.isChatOpened });
    if (prevState.isUserListOpned != this.props.isUserListOpned)
      this.setState({ isUserListOpned: this.props.isUserListOpned });
  }

  showChat(val) {
    this.setState({
      isChatOpened: val,
    });
    this.props.handleChatState(val);
    if (val) {
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
        value: "onlyChat",
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
        value: PANELS.CHAT,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: "public",
      });
    } else {
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
        value: false,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: false,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
        value: PANELS.NONE,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.NONE,
      });

      this.props.layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: "",
      });
    }
  }

  showUserList(val) {
    this.setState({
      isUserListOpned: val,
    });
    this.props.handleUserListState(val);
    if (val) {
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: true,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.USERLIST,
      });
    } else {
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
        value: false,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
        value: PANELS.NONE,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: "",
      });

      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: false,
      });
      this.props.layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.NONE,
      });
    }
  }

  handleChatClick() {
    if (this.state.isChatOpened) {
      this.showChat(false);
    } else {
      this.showUserList(false);
      this.showChat(true);
    }
  }

  handleUserListClick() {
    if (this.state.isUserListOpned) {
      this.showUserList(false);
    } else {
      this.showChat(false);
      this.showUserList(true);
    }
  }

  render() {
    const {
      amIPresenter,
      amIModerator,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      handleTakePresenter,
      intl,
      isSharingVideo,
      hasScreenshare,
      stopExternalVideoShare,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isSelectRandomUserEnabled,
      isRaiseHandButtonEnabled,
      isPresentationDisabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      setEmojiStatus,
      currentUser,
      shortcuts,
      layoutContextDispatch,
      actionsBarStyle,
      isOldMinimizeButtonEnabled,
      handleUserListState,
    } = this.props;

    return (
      <Styled.ActionsBar
        style={{
          height: actionsBarStyle.innerHeight,
        }}
      >
        <Styled.Left>
          <ActionsDropdown
            {...{
              amIPresenter,
              amIModerator,
              isPollingEnabled,
              isSelectRandomUserEnabled,
              allowExternalVideo,
              handleTakePresenter,
              intl,
              isSharingVideo,
              stopExternalVideoShare,
              isMeteorConnected,
              handleUserListState,
            }}
          />
          {isCaptionsAvailable ? (
            <CaptionsButtonContainer {...{ intl }} />
          ) : null}
        </Styled.Left>

        <Styled.Center>
          <AudioControlsContainer />
          {enableVideo ? <JoinVideoOptionsContainer /> : null}
          <ScreenshareButtonContainer
            {...{
              amIPresenter,
              isMeteorConnected,
            }}
          />
        </Styled.Center>
        <Styled.Right>
          {/* {!isOldMinimizeButtonEnabled ||
          (isOldMinimizeButtonEnabled &&
            isLayoutSwapped &&
            !isPresentationDisabled) ? (
            <PresentationOptionsContainer
              isLayoutSwapped={isLayoutSwapped}
              toggleSwapLayout={toggleSwapLayout}
              layoutContextDispatch={layoutContextDispatch}
              hasPresentation={isThereCurrentPresentation}
              hasExternalVideo={isSharingVideo}
              hasScreenshare={hasScreenshare}
            />
          ) : null} */}
          {isRaiseHandButtonEnabled ? (
            <Styled.RaiseHandButton
              icon="hand"
              label={intl.formatMessage({
                id: `app.actionsBar.emojiMenu.${
                  currentUser.emoji === "raiseHand"
                    ? "lowerHandLabel"
                    : "raiseHandLabel"
                }`,
              })}
              accessKey={shortcuts.raisehand}
              color={currentUser.emoji === "raiseHand" ? "primary" : "default"}
              data-test={
                currentUser.emoji === "raiseHand"
                  ? "lowerHandLabel"
                  : "raiseHandLabel"
              }
              ghost={currentUser.emoji !== "raiseHand"}
              emoji={currentUser.emoji}
              hideLabel
              circle
              size="lg"
              onClick={() => {
                setEmojiStatus(
                  currentUser.userId,
                  currentUser.emoji === "raiseHand" ? "none" : "raiseHand"
                );
              }}
            />
          ) : null}

          <Styled.ChatBtn
            icon="group_chat"
            color={"primary"}
            isActive={this.state.isChatOpened}
            onClick={this.handleChatClick.bind(this)}
            hasUnreadMessages={this.props.hasUnreadMessages}
            circle
            size="lg"
          />
        </Styled.Right>
      </Styled.ActionsBar>
    );
  }
}

export default withShortcutHelper(ActionsBar, ["raiseHand"]);
