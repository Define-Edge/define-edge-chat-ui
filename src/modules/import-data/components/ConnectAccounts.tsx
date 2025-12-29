import { ImportMethod } from "./shared/ImportMethod";
import { importMethods } from "../constants/import-methods";

interface ConnectAccountsProps {
  onConnect: (title: string) => void;
  onAnalyse: (type: string) => void;
  onRefresh: (title: string) => void;
}

export function ConnectAccounts({ onConnect, onAnalyse, onRefresh }: ConnectAccountsProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Connect Accounts</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {importMethods.map((method) => (
          <ImportMethod
            key={method.title}
            icon={method.icon}
            title={method.title}
            description={method.description}
            status={method.status}
            lastUpdated={method.lastUpdated}
            onConnect={() => onConnect(method.title)}
            onAnalyse={() => onAnalyse(method.title)}
            onRefresh={() => onRefresh(method.title)}
          />
        ))}
      </div>
    </div>
  );
}
