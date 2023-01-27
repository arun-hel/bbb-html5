import styled from "styled-components";
import { smallOnly } from "/imports/ui/stylesheets/styled-components/breakpoints";
import Button from "/imports/ui/components/common/button/component";

const HideDropdownButton = styled(Button)`
  ${({ open }) =>
    open
      ? `
  span {
    box-shadow: none;
  }
      @media ${smallOnly} {
        display:none;
      }
   `
      : `
   span {
     box-shadow: none;
     background-color: rgba(0,0,0,0.2) !important;
   }
       @media ${smallOnly} {
         display:none;
       }
    `}
`;

export default {
  HideDropdownButton,
};
