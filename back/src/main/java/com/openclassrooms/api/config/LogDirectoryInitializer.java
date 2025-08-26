package com.openclassrooms.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class LogDirectoryInitializer implements CommandLineRunner {
	@Override
	public void run(String... args) {
		File logsDir = new File("logs");
		if (!logsDir.exists()) {
			//noinspection ResultOfMethodCallIgnored
			logsDir.mkdirs();
		}
	}
} 