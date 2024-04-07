'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import z from 'zod'

const formShechma = z.object({
  name: z.string().min(2,{message:'2文字以上で入力してください'}).max(10, {message: '10文字以上で入力してください'})
})

type formType = z.infer<typeof formShechma>


const Contact = () => {

  const form = useForm<formType>({
    resolver: zodResolver(formShechma),
    defaultValues: {
      name: "",
    }
  })

  const onSubmit = (data:formType) => {
    console.log(data)
  }

  return (
    <div className='container h-screen flex items-center'>
      <div className='lg:w-[60%] w-full mx-auto'>
        <h2 className='text-[40px] font-bold mb-[30px]'>お問い合わせフォーム</h2>
        <Form {...form}>
          <form  className='space-y-8'  onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
             control={form.control}
             name = 'name'
             render={({field}) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder='名前を入力'{...field} />
                </FormControl>
                <FormDescription>名前を入力してください</FormDescription>
                <FormMessage/>
              </FormItem>
             )}
            />
            <Button>送信</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Contact