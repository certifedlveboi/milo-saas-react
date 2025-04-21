
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import EmailList from "./EmailList";

const EmailDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-500" />
              Gmail Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Connect Gmail Account
              </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-500" />
              Outlook Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              disabled
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : connectedAccounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Email Accounts Connected
          </h3>
          <p className="text-gray-600 mb-6">
            Connect your email accounts to view and manage your emails directly from here.
          </p>
        </motion.div>
      ) : (
        <EmailList accounts={connectedAccounts} emails={emails} />
      )}
    </div>
  );
};

export default EmailDashboard;
