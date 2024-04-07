'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { init, send } from '@emailjs/browser'
import toast, { Toaster } from 'react-hot-toast'

const formShechma = z.object({
  name: z.string().min(4,{message:'4文字以上で入力してください'}).max(15, {message: '15文字以下で入力してください'}),
  email: z.string().email({message: 'メールアドレスの形式ではありません'}),
  content: z.string().min(1,{message: '1文字以上で入力してください'})
})

type formType = z.infer<typeof formShechma>


const Contact = () => {

  const [isSending,setIsSending] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(formShechma),
    defaultValues: {
      name: "",
      email: "",
      content: ""
    }
  })

  const onSubmit:SubmitHandler<formType> = async (data:formType) => {


    const userId = process.env.NEXT_PUBLIC_USER_ID;
    const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;

    const {name,email,content} = data

    if(userId && serviceId && templateId){
      //送信処理開始
      setIsSending(true);
      const loadingToast = toast.loading("送信中")

      //email.jsを初期化
      init(userId)

      //送信するデータを定義
      const params = {
        name: name,
        email: email,
        content: content,
        from: 'お問い合わせフォームのフォーマット'
      }
      try{  
        await send(serviceId,templateId,params)
        toast.success('送信に成功しました')
      }
      catch{
       toast.error('送信に失敗しました。')
      }
      finally{
        form.reset()
        toast.dismiss(loadingToast)

        //処理完了
        setIsSending(false);
      }
    }
  }

  return (
    <div className='container h-screen flex items-center'>
      <Toaster/>
      <div className='lg:w-[60%] w-full mx-auto '>
        <h2 className='text-[30px] md:text-[40px] font-bold mb-[30px]'>お問い合わせフォーム</h2>
        <Form {...form}>
          <form  className='space-y-8'  onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
             control={form.control}
             name = 'name'
             render={({field}) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder='名前を入力'{...field} disabled={isSending} />
                </FormControl>
                <FormDescription>名前を入力してください</FormDescription>
                <FormMessage/>
              </FormItem>
             )}
            />
            <FormField 
             control={form.control}
             name = 'email'
             render={({field}) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder='exaple@yahoo.co.jp'{...field} disabled={isSending} />
                </FormControl>
                <FormDescription>メールアドレスを入力してください</FormDescription>
                <FormMessage/>
              </FormItem>
             )}
            />
            <FormField 
             control={form.control}
             name = 'content'
             render={({field}) => (
              <FormItem>
                <FormLabel>お問い合わせ内容</FormLabel>
                <FormControl >
                  <Textarea  placeholder='コールセンターのアドレスが知りたい'{...field} className='resize-none h-[200px]' disabled={isSending} />
                </FormControl>
                <FormDescription>お問い合わせ内容を入力してください</FormDescription>
                <FormMessage/>
              </FormItem>
             )}
            />
            <Button disabled={isSending}>送信</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Contact