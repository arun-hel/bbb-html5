import styled from "styled-components";
import { smallOnly } from "/imports/ui/stylesheets/styled-components/breakpoints";
import {
  smPaddingX,
  smPaddingY,
  borderSize,
} from "/imports/ui/stylesheets/styled-components/general";
import {
  colorWhite,
  colorDanger,
  colorGrayDark,
} from "/imports/ui/stylesheets/styled-components/palette";
import Button from "/imports/ui/components/common/button/component";

const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media ${smallOnly} {
    justify-content: center;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  > * {
    margin: 0 ${smPaddingX};

    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }

  @media ${smallOnly} {
    bottom: ${smPaddingX};
    left: ${smPaddingX};
    right: auto;

    [dir="rtl"] & {
      left: auto;
      right: ${smPaddingX};
    }
  }
`;

const Me = styled.div`
  @media ${smallOnly} {
    display: none;
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: row;
  > * {
    margin: 0 ${smPaddingX};

    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  @media ${smallOnly} {
    right: 0;
    left: 0;
  }

  > * {
    margin: 0 ${smPaddingX};

    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
`;

const RaiseHandButton = styled(Button)`
  ${({ emoji }) =>
    emoji !== "raiseHand"
      ? `
      span {
        box-shadow: none;
        background-color: rgba(0,0,0,0.2) !important;
      }
   `
      : `
   span {
     box-shadow: none;
     background-color: #018752 !important;
   }
   span > i {
    color: #ffff !important;
   }
`}
`;
const ChatBtn = styled(Button)`
  ${({ isActive }) =>
    !isActive
      ? `
      span {
        box-shadow: none;
        background-color: rgba(0,0,0,0.2) !important;
      }
   `
      : `
   span {
     box-shadow: none;
     background-color: #018752 !important;
   }
   span > i {
    color: #ffff !important;
   }
`}
  ${({ hasUnreadMessages }) =>
    hasUnreadMessages &&
    `
position: relative;

&:after {
  content: '';
  position: absolute;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  bottom: ${borderSize};
  right: 3px;
  top: 0;
  background-color: ${colorDanger};
  border: ${borderSize} solid #018752 !important;
}
`}
`;
const UserlstBtn = styled(Button)`
  ${({ isActive }) =>
    !isActive
      ? `
      span {
        box-shadow: none;
        background-color: rgba(0,0,0,0.2) !important;
      }
   `
      : `
   span {
     box-shadow: none;
     background-color: #018752 !important;
   }
   span > i {
    color: #ffff !important;
   }
`}
`;

export default {
  ActionsBar,
  Left,
  Center,
  Right,
  RaiseHandButton,
  ChatBtn,
  UserlstBtn,
  Me,
};
