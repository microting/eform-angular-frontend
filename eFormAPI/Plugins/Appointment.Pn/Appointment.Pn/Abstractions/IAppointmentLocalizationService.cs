namespace Appointment.Pn.Abstractions
{
    public interface IAppointmentLocalizationService
    {
        string GetString(string key);
        string GetString(string format, params object[] args);
    }
}