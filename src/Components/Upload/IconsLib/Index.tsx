import React, { ReactElement } from 'react';
import Ai from './Ai';
import Check from './Check';
import Close from './Close';
import Doc from './Doc';
import Jpg from './Jpg';
import Pdf from './Pdf';
import Png from './Png';
import Psd from './Psd';
import Xls from './Xls';
import Unknown from './Unknown';

interface IconProps {name: string; [key: string]: any; }

export default function Iconss({ name, ...rest }: IconProps): ReactElement {
  switch (name) {
    case "AI": return <Ai {...rest} />;
    case "CHECK": return <Check {...rest} />;
    case "CLOSE": return <Close {...rest} />;
    case "DOC": return <Doc {...rest} />;
    case "DOCX": return <Doc {...rest} />;
    case "JPG": return <Jpg {...rest} />;
    case "JPEG": return <Jpg {...rest} />;
    case "PDF": return <Pdf {...rest} />;
    case "PNG": return <Png {...rest} />;
    case "PSD": return <Psd {...rest} />;
    case "XLS": return <Xls {...rest} />;
    default: return <Unknown {...rest} />;  }
}
