import styled from "styled-components";
import {
  colorWhite,
  colorGrayDark,
  colorGrayLighter,
  colorPrimary,
  colorBlack,
} from "/imports/ui/stylesheets/styled-components/palette";

const Background = styled.div`
  position: fixed;
  display: flex;
  flex-flow: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${colorPrimary};
  color: ${colorBlack};
  text-align: center;
`;

const Message = styled.h1`
  margin: 0;
  color: ${colorBlack};
  font-size: 1.75rem;
  font-weight: 400;
  margin-bottom: 1rem;
`;

const SessionMessage = styled.div`
  margin: 0;
  color: ${colorBlack};
  font-weight: 400;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const Separator = styled.div`
  height: 0;
  width: 5rem;
  border: 1px solid ${colorBlack};
  margin: 1.5rem 0 1.5rem 0;
  align-self: center;
  opacity: 0.75;
`;

const CodeError = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: ${colorBlack};
`;

export default {
  Background,
  Message,
  SessionMessage,
  Separator,
  CodeError,
};
