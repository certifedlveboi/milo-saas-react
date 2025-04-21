
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TeamsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              Microsoft Teams Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            
              <Button disabled className="w-full bg-blue-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </Button>

          </CardContent>
        </Card>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Microsoft Teams Not Connected
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your Microsoft Teams account to view and manage your teams directly from here.
            </p>
          </motion.div>
      </motion.div>
    </div>
  );
};

export default TeamsDashboard;
