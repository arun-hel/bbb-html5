import styled from "styled-components";
import ButtonEmoji from "/imports/ui/components/common/button/button-emoji/ButtonEmoji";
import Button from "/imports/ui/components/common/button/component";

const AudioDropdown = styled(ButtonEmoji)`
  span {
    i {
      width: 0px !important;
      bottom: 1px;
    }
  }
`;

const AudioBtn = styled(Button)`
  ${({ isConnected }) =>
    !isConnected
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
  AudioDropdown,
  AudioBtn,
};
