"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ContactForm() {
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission logic will be added later
    console.log("Form submitted");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Us a Message</CardTitle>
        <CardDescription>We&#39;ll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Fill out the form below and we&#39;ll get back to you as soon as possible.
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Your Name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" required />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" type="text" placeholder="Message Subject" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Write your message here..." required rows={5}/>
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </CardContent>
    </Card>
  )
}
