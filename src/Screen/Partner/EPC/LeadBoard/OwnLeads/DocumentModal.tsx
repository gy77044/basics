import { useState, memo } from 'react';
import { getActiveClass } from '../../../../../Utils/commonFunctions';
import CustomerDocuments from './CustomerDocuments';
import EPCDocumets from './EPCDocumets';
const DocumentModal = () => {
  const [activeTab, setActiveTab] = useState("Customer Documents");
  const handleTheTab = (tabName: string) => setActiveTab(tabName);
  const tabsComponent = [{ tab: "EPC Document", Component: EPCDocumets },{ tab: "Customer Documents", Component: CustomerDocuments }];
  return (
    <> 
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <ul className="-mb-px flex gap-6">
          {tabsComponent.map((item, index) => (
            <li className={`cursor-pointer ${getActiveClass(activeTab, item.tab, "tab-active")}`} key={index} onClick={() => handleTheTab(item.tab)}>
              {item.tab}
            </li>
          ))}
        </ul>
      </div>
      {/* Active Tab Content */}
      <div className="overflow-auto custom-scrollbar-css">
        {tabsComponent.map((item) =>activeTab === item.tab ? ( <div className="tabs-activebody" key={item.tab}><item.Component /></div>) : null)}
      </div>
    </>
  );
};

export default memo(DocumentModal);
