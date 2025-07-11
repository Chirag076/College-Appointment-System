Commands
```
http://localhost:5000/api/auth/register
{
  "name": "Dr. Sharma",
  "email": "professor@example.com",
  "password": "prof123",
  "role": "professor"
}
{
  "name": "Chirag Student",
  "email": "student@example.com",
  "password": "student123",
  "role": "student"
}
http://localhost:5000/api/auth/login
{
  "email": "student@example.com",
  "password": "student123"
}
{
  "email": "professor@example.com",
  "password": "prof123"
}
http://localhost:5000/api/user/availability      professor token      #set availibility
{
  "date": "2025-07-08",
  "time": "16:00-17:00"
}
http://localhost:5000/api/user/professorid/availability  to get the all the availibility of the professor

http://localhost:5000/api/booking/       student token to book a appointment
{
  "professorId": "686ce7c5c874499622340d31",
  "availabilityId": "686cec39c874499622340d3a"
}
http://localhost:5000/api/booking/me  with student token to get the appointmnet
DELETE http://localhost:5000/api/booking/:id  with professor token 
```
