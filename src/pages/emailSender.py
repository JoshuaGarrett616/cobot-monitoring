import smtplib
import ssl

port = 587
password = input("SuperP00per69")

context = ssl.create_default_context()

with smtplib.SMTP_SSL("smtp-mail.outlook.com", port, context=context)
	server.login("joshua.garrett@pbclinear.com", password)
	print("Connected")