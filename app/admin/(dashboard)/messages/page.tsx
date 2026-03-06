"use client"

import { useState, useEffect } from "react"
import { ContactMessage } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Loader2,
  Mail,
  MailOpen,
  Eye,
  MessageSquare,
} from "lucide-react"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null)

  const fetchMessages = async () => {
    const res = await fetch("/api/admin/messages")
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const toggleRead = async (msg: ContactMessage) => {
    await fetch(`/api/admin/messages/${msg.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !msg.read }),
    })
    fetchMessages()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
    fetchMessages()
  }

  const handleView = async (msg: ContactMessage) => {
    setViewMessage(msg)
    if (!msg.read) {
      await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
      fetchMessages()
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الرسائل</h1>
          <p className="text-muted-foreground mt-1">
            رسائل التواصل من زوار الموقع
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="mr-2 h-5 px-2 text-[10px]"
              >
                {unreadCount} غير مقروءة
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* View message dialog */}
      <Dialog
        open={!!viewMessage}
        onOpenChange={(open) => !open && setViewMessage(null)}
      >
        <DialogContent className="max-w-lg" dir="rtl">
          {viewMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{viewMessage.subject || "بدون موضوع"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">الاسم</p>
                    <p className="font-medium">{viewMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium" dir="ltr">
                      {viewMessage.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">الرسالة</p>
                  <div className="rounded-xl bg-secondary/50 p-4 text-sm whitespace-pre-wrap">
                    {viewMessage.message}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(viewMessage.created_at).toLocaleString("ar")}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg">لا توجد رسائل بعد</p>
          <p className="text-sm">ستظهر هنا عندما يرسل أحد رسالة من الموقع</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-right w-8"></TableHead>
                <TableHead className="text-right">المرسل</TableHead>
                <TableHead className="text-right">الموضوع</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={`border-border/50 cursor-pointer transition-colors hover:bg-secondary/30 ${
                    !msg.read ? "bg-gold/3" : ""
                  }`}
                  onClick={() => handleView(msg)}
                >
                  <TableCell>
                    {msg.read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-gold" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={`text-sm ${!msg.read ? "font-bold" : "font-medium"}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {msg.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm max-w-[200px] truncate ${!msg.read ? "font-semibold" : ""}`}>
                    {msg.subject || "بدون موضوع"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString("ar")}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(msg)}
                        className="h-8 w-8 hover:text-gold"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRead(msg)}
                        className="h-8 w-8 hover:text-gold"
                        title={msg.read ? "تعيين كغير مقروء" : "تعيين كمقروء"}
                      >
                        {msg.read ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailOpen className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الرسالة</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(msg.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
