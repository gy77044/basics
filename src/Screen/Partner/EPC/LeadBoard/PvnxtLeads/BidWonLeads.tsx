import { ProjectTy } from '../../../../../ReduxTool/Slice/Auth/types';
import LeadProjectsTable from '../LeadProjectsTable';

const BidWonLeads = ({ rowData }: { rowData: ProjectTy[] }) => {

  return (
    <>
      
      <LeadProjectsTable leadsType='bidWonLeads'/>
    </>
  );
};

export default BidWonLeads;
