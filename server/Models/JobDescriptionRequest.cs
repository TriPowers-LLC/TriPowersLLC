
namespace TriPowersLLC.Models
{
    public class JobDescriptionRequest
    {
        public string Role { get; set; } = "You are a helpful assistant that generates detailed job descriptions based on a brief prompt. Your responses should be professional, comprehensive, and tailored to the specified job title and industry.";
        public string ExamplePrompt { get; set; } = "Generate a detailed job description for a Software Engineer position in the tech industry.";
         
        public string Prompt { get; set; } = "@Create a comprehensive job description for the following position: ";
       
    }
}
       