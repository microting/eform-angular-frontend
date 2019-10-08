# Integration with Microting Backend

In order for you to be able to communicate with any API endpoints published within the Microting Backend, you need to first obtain an access token.

After obtaining the access\_token as shown in the example below, the token must be inserted as a header attribute Authorization: Bearer access\_token. It's important to prepend the access\_token with "Bearer ".

We will assume for the examples that you have a user with email admin@admin.com and the password Qq1234567$. This is the same email and password used in the automated tests and the dev environment is running at localhost:5000.

{% api-method method="post" host="http://localhost:5000" path="/api/auth/token" %}
{% api-method-summary %}
Authenticate to get access\_token
{% endapi-method-summary %}

{% api-method-description %}
Authenticate a user.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="Username" type="string" required=false %}
admin@admin.com
{% endapi-method-parameter %}

{% api-method-parameter name="Password" type="string" %}
Qq1234567$
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Cake successfully retrieved.
{% endapi-method-response-example-description %}

```javascript
{
	"model": {
		"id": 1,
		"role": "admin",
		"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiMDg1ZDg2YjItZjZhYS00OWIyLTg0Y2ItM2ZmNTk4NGU5ODgyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4iLCJ3b3JrZXJzX3JlYWQiOiJUcnVlIiwid29ya2Vyc19jcmVhdGUiOiJUcnVlIiwid29ya2Vyc19kZWxldGUiOiJUcnVlIiwid29ya2Vyc191cGRhdGUiOiJUcnVlIiwic2l0ZXNfcmVhZCI6IlRydWUiLCJzaXRlc19kZWxldGUiOiJUcnVlIiwic2l0ZXNfdXBkYXRlIjoiVHJ1ZSIsImVudGl0eV9zZWFyY2hfcmVhZCI6IlRydWUiLCJlbnRpdHlfc2VhcmNoX2NyZWF0ZSI6IlRydWUiLCJlbnRpdHlfc2VhcmNoX2RlbGV0ZSI6IlRydWUiLCJlbnRpdHlfc2VhcmNoX3VwZGF0ZSI6IlRydWUiLCJlbnRpdHlfc2VsZWN0X3JlYWQiOiJUcnVlIiwiZW50aXR5X3NlbGVjdF9jcmVhdGUiOiJUcnVlIiwiZW50aXR5X3NlbGVjdF9kZWxldGUiOiJUcnVlIiwiZW50aXR5X3NlbGVjdF91cGRhdGUiOiJUcnVlIiwidXNlcnNfcmVhZCI6IlRydWUiLCJ1c2Vyc19jcmVhdGUiOiJUcnVlIiwidXNlcnNfZGVsZXRlIjoiVHJ1ZSIsInVzZXJzX3VwZGF0ZSI6IlRydWUiLCJ1bml0c19yZWFkIjoiVHJ1ZSIsInVuaXRzX3VwZGF0ZSI6IlRydWUiLCJkZXZpY2VfdXNlcnNfcmVhZCI6IlRydWUiLCJkZXZpY2VfdXNlcnNfY3JlYXRlIjoiVHJ1ZSIsImRldmljZV91c2Vyc19kZWxldGUiOiJUcnVlIiwiZGV2aWNlX3VzZXJzX3VwZGF0ZSI6IlRydWUiLCJjYXNlc19yZWFkIjoiVHJ1ZSIsImNhc2VfcmVhZCI6IlRydWUiLCJjYXNlX3VwZGF0ZSI6IlRydWUiLCJjYXNlX2RlbGV0ZSI6IlRydWUiLCJjYXNlX2dldF9wZGYiOiJUcnVlIiwiY2FzZV9nZXRfZG9jeCI6IlRydWUiLCJjYXNlX2dldF9wcHR4IjoiVHJ1ZSIsImVmb3Jtc19kZWxldGUiOiJUcnVlIiwiZWZvcm1zX2NyZWF0ZSI6IlRydWUiLCJlZm9ybXNfcmVhZCI6IlRydWUiLCJlZm9ybXNfdXBkYXRlX2NvbHVtbnMiOiJUcnVlIiwiZWZvcm1zX2Rvd25sb2FkX3htbCI6IlRydWUiLCJlZm9ybXNfdXBsb2FkX3ppcCI6IlRydWUiLCJlZm9ybXNfcGFpcmluZ19yZWFkIjoiVHJ1ZSIsImVmb3Jtc19wYWlyaW5nX3VwZGF0ZSI6IlRydWUiLCJlZm9ybXNfcmVhZF90YWdzIjoiVHJ1ZSIsImVmb3Jtc191cGRhdGVfdGFncyI6IlRydWUiLCJlZm9ybXNfZ2V0X2NzdiI6IlRydWUiLCJlZm9ybXNfcmVhZF9qYXNwZXJfcmVwb3J0IjoiVHJ1ZSIsImVmb3Jtc191cGRhdGVfamFzcGVyX3JlcG9ydCI6IlRydWUiLCJleHAiOjE1NzA1NDkwNzcsImlzcyI6ImVGb3JtIEFQSSIsImF1ZCI6ImVGb3JtIEFQSSJ9.Gdtxz1YXZOqIP9-fIIEyWRD0dvWCuMnG4sJfIeFpI5g",
		"token_type": null,
		"expires_in": null,
		"userName": "admin@admin.com"
	},
	"success": true,
	"message": "Success"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

