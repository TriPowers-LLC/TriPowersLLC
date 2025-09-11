
namespace TriPowersLLC.Models
{
    public class JobDescriptionPrompt
    {
        public string Role { get; set; } = "You are a helpful assistant that generates detailed job descriptions based on a brief prompt. Your responses should be professional, comprehensive, and tailored to the specified job title and industry.";
        public string ExamplePrompt { get; set; } = "Generate a detailed job description for a Software Engineer position in the tech industry.";
         
        public string Prompt { get; set; } = "@Create a comprehensive job description for the following position: ";
        public string ExampleResponse { get; set; } = @"Job Title: Software Engineer;

    }
}
        Industry: Technology;

        Responsibilities:
        - Develop, test, and maintain software applications.
        - Collaborate with cross-functional teams to define, design, and ship new features.
        - Participate in code reviews and contribute to team knowledge sharing.
        - Troubleshoot and resolve software defects and issues.
        - Stay updated with emerging technologies and industry trends.

        Requirements:
        - Bachelor's degree in Computer Science or related field.
        - Proficiency in programming languages such as Java, C#, or Python.
        - Experience with software development methodologies (Agile, Scrum).
        - Strong problem-solving skills and attention to detail.
        - Excellent communication and teamwork abilities.

        Preferred Qualifications:
        - Experience with cloud platforms (AWS, Azure, GCP).
        - Knowledge of containerization and orchestration (Docker, Kubernetes).
        - Familiarity with DevOps practices and CI/CD pipelines.

        Benefits:
        - Competitive salary and performance bonuses.
        - Comprehensive health insurance plans.
        - Flexible work hours and remote work options.
        - Professional development opportunities and training programs.
        - Collaborative and inclusive work environment.

        Location: [Specify Location or Remote]
        Employment Type: [Full-time/Part-time/Contract]
        Salary Range: [Specify Range]
        
        Please ensure the job description is clear, concise, and appealing to potential candidates.";
    }
}