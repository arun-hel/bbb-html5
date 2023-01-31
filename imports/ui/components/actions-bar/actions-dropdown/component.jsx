import _ from "lodash";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { makeCall } from "/imports/ui/services/api";
import { defineMessages } from "react-intl";
import { withModalMounter } from "/imports/ui/components/common/modal/service";
import withShortcutHelper from "/imports/ui/components/shortcut-help/service";
import ExternalVideoModal from "/imports/ui/components/external-video-player/modal/container";
import RandomUserSelectContainer from "/imports/ui/components/common/modal/random-user/container";
import EndMeetingConfirmationContainer from "/imports/ui/components/end-meeting-confirmation/container";
import SettingsMenuContainer from "/imports/ui/components/settings/container";
import BBBMenu from "/imports/ui/components/common/menu/component";
import Styled from "./styles";
import { PANELS, ACTIONS } from "../../layout/enums";
import { colorPrimary } from "/imports/ui/stylesheets/styled-components/palette";
import { meetingIsBreakout } from "/imports/ui/components/app/service";
import { colorDanger } from "/imports/ui/stylesheets/styled-components/palette";
import browserInfo from "/imports/utils/browserInfo";
import deviceInfo from "/imports/utils/deviceInfo";
import FullscreenService from "/imports/ui/components/common/fullscreen-button/service";

const propTypes = {
  amIPresenter: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  mountModal: PropTypes.func.isRequired,
  amIModerator: PropTypes.bool.isRequired,
  shortcuts: PropTypes.string,
  handleTakePresenter: PropTypes.func.isRequired,
  allowExternalVideo: PropTypes.bool.isRequired,
  stopExternalVideoShare: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

const defaultProps = {
  shortcuts: "",
};

const { isIphone } = deviceInfo;
const { isSafari, isValidSafariVersion } = browserInfo;

const ALLOW_FULLSCREEN = Meteor.settings.public.app.allowFullscreen;
const FULLSCREEN_CHANGE_EVENT = isSafari
  ? "webkitfullscreenchange"
  : "fullscreenchange";

const intlMessages = defineMessages({
  actionsLabel: {
    id: "app.actionsBar.actionsDropdown.actionsLabel",
    description: "Actions button label",
  },
  fullscreenLabel: {
    id: "app.navBar.settingsDropdown.fullscreenLabel",
    description: "Make fullscreen option label",
  },
  exitFullscreenLabel: {
    id: "app.navBar.settingsDropdown.exitFullscreenLabel",
    description: "Exit fullscreen option label",
  },
  presentationLabel: {
    id: "app.actionsBar.actionsDropdown.presentationLabel",
    description: "Upload a presentation option label",
  },
  endMeetingLabel: {
    id: "app.navBar.settingsDropdown.endMeetingLabel",
    description: "End meeting options label",
  },
  settingsLabel: {
    id: "app.navBar.settingsDropdown.settingsLabel",
    description: "Open settings option label",
  },
  presentationDesc: {
    id: "app.actionsBar.actionsDropdown.presentationDesc",
    description: "adds context to upload presentation option",
  },
  desktopShareDesc: {
    id: "app.actionsBar.actionsDropdown.desktopShareDesc",
    description: "adds context to desktop share option",
  },
  stopDesktopShareDesc: {
    id: "app.actionsBar.actionsDropdown.stopDesktopShareDesc",
    description: "adds context to stop desktop share option",
  },
  pollBtnLabel: {
    id: "app.actionsBar.actionsDropdown.pollBtnLabel",
    description: "poll menu toggle button label",
  },
  leaveSessionLabel: {
    id: "app.navBar.settingsDropdown.leaveSessionLabel",
    description: "Leave session button label",
  },
  pollBtnDesc: {
    id: "app.actionsBar.actionsDropdown.pollBtnDesc",
    description: "poll menu toggle button description",
  },
  takePresenter: {
    id: "app.actionsBar.actionsDropdown.takePresenter",
    description: "Label for take presenter role option",
  },
  takePresenterDesc: {
    id: "app.actionsBar.actionsDropdown.takePresenterDesc",
    description: "Description of take presenter role option",
  },
  startExternalVideoLabel: {
    id: "app.actionsBar.actionsDropdown.shareExternalVideo",
    description: "Start sharing external video button",
  },
  stopExternalVideoLabel: {
    id: "app.actionsBar.actionsDropdown.stopShareExternalVideo",
    description: "Stop sharing external video button",
  },
  selectRandUserLabel: {
    id: "app.actionsBar.actionsDropdown.selectRandUserLabel",
    description: "Label for selecting a random user",
  },
  selectRandUserDesc: {
    id: "app.actionsBar.actionsDropdown.selectRandUserDesc",
    description: "Description for select random user option",
  },
});

const handlePresentationClick = () =>
  Session.set("showUploadPresentationView", true);

class ActionsDropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUserListOpned: false,
      isFullScreen: false,
    };
    this.LOGOUT_CODE = "680";
    this.presentationItemId = _.uniqueId("action-item-");
    this.pollId = _.uniqueId("action-item-");
    this.takePresenterId = _.uniqueId("action-item-");
    this.selectUserRandId = _.uniqueId("action-item-");

    this.handleExternalVideoClick = this.handleExternalVideoClick.bind(this);
    this.makePresentationItems = this.makePresentationItems.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.isUserListOpned = false;
  }

  componentDidMount() {
    this.state = {
      isUserListOpned: this.props.isUserListOpned,
    };
    document.documentElement.addEventListener(
      FULLSCREEN_CHANGE_EVENT,
      this.onFullscreenChange
    );
  }

  componentDidUpdate(prevProps) {
    const { amIPresenter: wasPresenter } = prevProps;
    const { amIPresenter: isPresenter, mountModal } = this.props;
    if (wasPresenter && !isPresenter) {
      mountModal(null);
    }
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener(
      FULLSCREEN_CHANGE_EVENT,
      this.onFullscreenChange
    );
  }

  handleExternalVideoClick() {
    const { mountModal } = this.props;
    mountModal(<ExternalVideoModal />);
  }

  handleUserListClick() {
    this.showUserList(true);
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

  leaveSession() {
    makeCall("userLeftMeeting");
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set("codeError", this.LOGOUT_CODE);
  }

  onFullscreenChange() {
    const { isFullscreen } = this.state;
    const newIsFullscreen = FullscreenService.isFullScreen(
      document.documentElement
    );
    if (isFullscreen !== newIsFullscreen) {
      this.setState({ isFullScreen: newIsFullscreen });
    }
  }

  getAvailableActions() {
    const {
      intl,
      amIPresenter,
      allowExternalVideo,
      handleTakePresenter,
      isSharingVideo,
      isPollingEnabled,
      isSelectRandomUserEnabled,
      stopExternalVideoShare,
      mountModal,
      layoutContextDispatch,
      hidePresentation,
      amIModerator,
      isMeteorConnected,
    } = this.props;

    const { pollBtnLabel, presentationLabel, takePresenter } = intlMessages;

    const { formatMessage } = intl;

    const actions = [];

    const isBreakout = meetingIsBreakout();

    const allowedToEndMeeting = amIModerator && !isBreakout;
    const allowLogoutSetting = Meteor.settings.public.app.allowLogout;
    const handleToggleFullscreen = () => FullscreenService.toggleFullScreen();

    if (amIPresenter && !hidePresentation) {
      actions.push({
        icon: "presentation",
        dataTest: "managePresentations",
        label: formatMessage(presentationLabel),
        key: this.presentationItemId,
        onClick: handlePresentationClick,
        dividerTop: this.props?.presentations?.length > 1 ? true : false,
      });
    }

    if (amIPresenter && isPollingEnabled) {
      actions.push({
        icon: "polling",
        dataTest: "polling",
        label: formatMessage(pollBtnLabel),
        key: this.pollId,
        onClick: () => {
          if (Session.equals("pollInitiated", true)) {
            Session.set("resetPollPanel", true);
          }
          layoutContextDispatch({
            type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
            value: true,
          });
          layoutContextDispatch({
            type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
            value: PANELS.POLL,
          });
          Session.set("forcePollOpen", true);
        },
      });
    }

    if (!amIPresenter && amIModerator) {
      actions.push({
        icon: "presentation",
        label: formatMessage(takePresenter),
        key: this.takePresenterId,
        onClick: () => handleTakePresenter(),
      });
    }

    if (amIPresenter && allowExternalVideo) {
      actions.push({
        icon: !isSharingVideo ? "external-video" : "external-video_off",
        label: !isSharingVideo
          ? intl.formatMessage(intlMessages.startExternalVideoLabel)
          : intl.formatMessage(intlMessages.stopExternalVideoLabel),
        key: "external-video",
        onClick: isSharingVideo
          ? stopExternalVideoShare
          : this.handleExternalVideoClick,
        dataTest: "shareExternalVideo",
      });
    }

    // if (amIPresenter && isSelectRandomUserEnabled) {
    //   actions.push({
    //     icon: "pointer",
    //     label: intl.formatMessage(intlMessages.selectRandUserLabel),
    //     key: this.selectUserRandId,
    //     onClick: () =>
    //       mountModal(<RandomUserSelectContainer isSelectedUser={false} />),
    //     dataTest: "selectRandomUser",
    //   });
    // }

    actions.push({
      icon: "user_list",
      key: "userList",
      label: "User list",
      onClick: () => this.handleUserListClick(),
      dataTest: "userList",
    });

    if (ALLOW_FULLSCREEN) {
      actions.push({
        icon: `${this.state.isFullScreen ? "exit_fullscreen" : "fullscreen"}`,
        key: "list-item-fullscreen",
        label: `${
          this.state.isFullScreen
            ? intl.formatMessage(intlMessages.exitFullscreenLabel)
            : intl.formatMessage(intlMessages.fullscreenLabel)
        }`,
        onClick: handleToggleFullscreen,
        dataTest: `${
          this.state.isFullScreen ? "exitFullScreen" : "fullScreen"
        }`,
      });
    }

    // actions.push({
    //   icon: "settings",
    //   key: "settings",
    //   label: intl.formatMessage(intlMessages.settingsLabel),
    //   onClick: () => mountModal(<SettingsMenuContainer />),
    //   dataTest: "settings",
    // });

    if (allowedToEndMeeting && isMeteorConnected) {
      actions.push({
        key: "list-item-end-meeting",
        icon: "application",
        label: intl.formatMessage(intlMessages.endMeetingLabel),
        onClick: () => mountModal(<EndMeetingConfirmationContainer />),
      });
    }

    if (allowLogoutSetting && isMeteorConnected) {
      const customStyles = { color: colorDanger };
      actions.push({
        key: "list-item-logout",
        dataTest: "logout",
        icon: "logout",
        label: intl.formatMessage(intlMessages.leaveSessionLabel),
        customStyles,
        onClick: () => this.leaveSession(),
      });
    }

    return actions;
  }

  makePresentationItems() {
    const { presentations, setPresentation, podIds } = this.props;

    if (!podIds || podIds.length < 1) return [];

    // We still have code for other pods from the Flash client. This intentionally only cares
    // about the first one because it's the default.
    const { podId } = podIds[0];

    const presentationItemElements = presentations
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => {
        const customStyles = { color: colorPrimary };

        return {
          customStyles: p.current ? customStyles : null,
          icon: "file",
          iconRight: p.current ? "check" : null,
          label: p.name,
          description: "uploaded presentation file",
          key: `uploaded-presentation-${p.id}`,
          onClick: () => {
            setPresentation(p.id, podId);
          },
        };
      });

    return presentationItemElements;
  }

  render() {
    const {
      intl,
      amIPresenter,
      amIModerator,
      shortcuts: OPEN_ACTIONS_AK,
      isMeteorConnected,
      isDropdownOpen,
      isMobile,
      isRTL,
    } = this.props;

    const availableActions = this.getAvailableActions();
    const availablePresentations = this.makePresentationItems();
    const children =
      availablePresentations.length > 1 && amIPresenter
        ? availablePresentations.concat(availableActions)
        : availableActions;

    if (availableActions.length === 0 || !isMeteorConnected) {
      return null;
    }
    const customStyles = { top: "-1rem" };

    return (
      <BBBMenu
        customStyles={!isMobile ? customStyles : null}
        accessKey={OPEN_ACTIONS_AK}
        trigger={
          <Styled.HideDropdownButton
            open={isDropdownOpen}
            hideLabel
            aria-label={intl.formatMessage(intlMessages.actionsLabel)}
            data-test="actionsButton"
            label={intl.formatMessage(intlMessages.actionsLabel)}
            icon="more"
            color="primary"
            size="lg"
            circle
            onClick={() => null}
          />
        }
        actions={children}
        opts={{
          id: "default-dropdown-menu",
          keepMounted: true,
          transitionDuration: 0,
          elevation: 3,
          getContentAnchorEl: null,
          fullwidth: "true",
          anchorOrigin: {
            vertical: "top",
            horizontal: isRTL ? "right" : "left",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: isRTL ? "right" : "left",
          },
        }}
      />
    );
  }
}

ActionsDropdown.propTypes = propTypes;
ActionsDropdown.defaultProps = defaultProps;

export default withShortcutHelper(
  withModalMounter(ActionsDropdown),
  "openActions"
);
