import styled from "styled-components";
import Button from "/imports/ui/components/common/button/component";
import { colorWhite } from "/imports/ui/stylesheets/styled-components/palette";

const VideoButton = styled(Button)`
  ${({ ghost }) =>
    ghost
      ? `
    & > span {
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

const OffsetBottom = styled.div`
  position: relative;
`;

export default {
  VideoButton,
  OffsetBottom,
};
